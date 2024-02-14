const NodeMediaServer = require('node-media-server');
const PocketBase = require('pocketbase/cjs')
const jwt = require('jsonwebtoken');
require('dotenv').config();

const config = {
    rtmp: {
        port: 1935,
        chunk_size: 60000,
        gop_cache: true,
        ping: 30,
        ping_timeout: 60
    },
    http: {
        port: 8000,
        allow_origin: '*'
    }
};

var nms = new NodeMediaServer(config);
nms.run();

const pb = new PocketBase("http://127.0.0.1:8090");
pb.admins.authWithPassword(process.env.POCKETBASE_ADMIN_EMAIL, process.env.POCKETBASE_ADMIN_PASSWORD);

const secretKey = process.env.JWT_SECRET;

nms.on('prePublish', async (id, StreamPath, args) => {
    let session = nms.getSession(id);
    const { token } = args;
    const streamKeyAndToken = StreamPath.split("/").pop();
    const [streamKey, tokenQuery] = streamKeyAndToken.split("?");

    if (!token) {
        console.log(`[${id}] JWT token not provided`);
        session.reject();
        return;
    }

    try {
        const decoded = jwt.verify(token, secretKey);

        if (decoded.stream_key !== streamKey) {
            console.log(`[${id}] Stream key doesnt match`);
            console.log(`[${id}] ${decoded.stream_key} !== ${streamKey}`);
            session.reject();
            return;
        }

        console.log(streamKey)
        const stream = await pb.collection("streams").getFirstListItem(`stream_key="${streamKey}"`);
        await pb.collection("streams").update(stream.id, { is_live: true });
        return true;
    } catch (error) {
        console.log(`[${id}] Error while connecting: ${error}`);
        session.reject();
    }
});

nms.on('prePlay', async (id, args) => {
    console.log('[NodeEvent on prePlay]', `id=${id} args=${JSON.stringify(args)}`);
    let session = nms.getSession(id);
    const rawStreamPath = args;
    const streamPath = rawStreamPath.split("/").pop();

    if (!rawStreamPath && !rawStreamPath.startsWith("/live/")) {
        console.log(`[${id}] Stream path not found`);
        session.reject();
    }

    try {
        const connectionAmount = session.req.socket.server._connections ?? 0;
        const stream = await pb.collection("streams").getFirstListItem(`stream_key="${streamPath}"`, { requestKey: "test" }).catch((error) => {
            if (error.status === 0) return;

            console.log(`[${id}] Error getting stream data: ${error}`);
            session.reject();
        });

        await pb.collection("streams").update(stream.id, {
            viewers: connectionAmount
        }, { requestKey: "test" });

        console.log(`[${id}] Stream data updated`);
    } catch (error) {

        console.log(`[${id}] Error verifying token: ${error}`);
        session.reject();
    }
});

nms.on('postPlay', async (id, args) => {
    let session = nms.getSession(id);
    const rawStreamPath = args;
    const streamPath = rawStreamPath.split("/").pop();

    if (!rawStreamPath && !rawStreamPath.startsWith("/live/")) {
        console.log(`[${id}] Stream path not found`);
        session.reject();
    }

    try {
        const connectionAmount = session.req.socket.server._connections ?? 0;
        const stream = await pb.collection("streams").getFirstListItem(`stream_key="${streamPath}"`);
        await pb.collection("streams").update(stream.id, {
            viewers: connectionAmount
        });
        console.log(`[${id}] Stream data updated`);
        return true;
    } catch (error) {
        session.reject();
    }
});

nms.on('donePublish', async (id, args) => { //stop stream event
    let session = nms.getSession(id);

    const rawStreamPath = args;
    const streamPath = rawStreamPath.split("/").pop();

    if (!rawStreamPath && !rawStreamPath.startsWith("/live/")) {
        console.log(`[${id}] Stream path not found`);
        session.reject();
    }


    const token = session.publishArgs.token;

    if (!token) {
        console.log(`[${id}] JWT token not provided`);
        session.reject();
        return;
    }

    try {
        const stream = await pb.collection("streams").getFirstListItem(`stream_key="${streamPath}"`);
        await pb.collection("streams").update(stream.id, { is_live: false, viewers: 0 });
        return true;
    } catch (error) {
        console.log(`[${id}] Error verifying token: ${error}`);
        session.reject();
    }
});