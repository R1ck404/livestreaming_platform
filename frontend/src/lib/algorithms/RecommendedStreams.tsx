interface Stream {
    id: string;
    user: { id: string };
    tags: { value: string }[];
    is_live: boolean;
    viewers: number;
}

interface UserMetric {
    streamer: string;
    interaction_type: 'view' | 'like' | 'share' | 'follow' | 'chat';
    stream_tags: { value: string }[];
}


function getStreamScore(userMetrics: UserMetric[], stream: Stream): number {
    let score = 0;

    userMetrics.forEach(metric => {
        if (metric.streamer === stream.id) {
            switch (metric.interaction_type) {
                case 'view': score += 1; break;
                case 'like': score += 2; break;
                case 'share': score += 3; break;
                case 'follow': score += 4; break;
                case 'chat': score += 2; break;
            }
        }
    });

    stream.tags.forEach(tag => {
        if (userMetrics.some(metric => metric.stream_tags.some(stag => stag.value === tag.value))) {
            score += 5;
        }
    });

    score += Math.log1p(stream.viewers);

    return score;
}

function recommendStreams(userMetrics: UserMetric[], streams: Stream[], count: number): Stream[] {
    const scoredStreams = streams.map(stream => ({
        ...stream,
        score: getStreamScore(userMetrics, stream)
    }));

    return scoredStreams.sort((a, b) => b.score - a.score).slice(0, count);
}

export { recommendStreams };
export type { Stream, UserMetric };
