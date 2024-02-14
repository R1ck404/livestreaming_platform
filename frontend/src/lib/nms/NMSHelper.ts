export function fetchStreams() {
    const url = process.env.NEXT_PUBLIC_NMS_API_URL + "/api/streams";
    return fetch(url).then((res) => res.json());
}

export function fetchStream(streamdata: any[], name: string) {
    const stream = streamdata.find((stream) => stream.name === name);
    return stream;
}

export function fetchMostPopularStream(streamdata: any[]) {
    let mostPopularStream = null;
    let highestSubscriberCount = -1;

    streamdata.forEach((stream) => {
        console.log(stream.subscribers.length);
        if (stream.subscribers.length > highestSubscriberCount) {
            highestSubscriberCount = stream.subscribers.length;
            mostPopularStream = stream;
        }
    });

    return mostPopularStream;
}
