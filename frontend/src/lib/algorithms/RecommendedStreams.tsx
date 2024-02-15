interface Stream {
    id: string;
    user: { id: string };
    tags: { value: string }[];
    is_live: boolean;
    viewers: number;
}

interface UserMetric {
    stream: string;
    interaction_type: 'view' | 'like' | 'share' | 'follow' | 'chat';
    stream_tags: { value: string }[];
}

function getStreamScore(userMetrics: UserMetric[], stream: Stream): number {
    let score = 0;

    userMetrics && userMetrics.length > 0 && userMetrics.forEach(metric => {
        if (metric.stream === stream.id) {
            switch (metric.interaction_type) {
                case 'view': score += 1; break;
                case 'like': score += 2; break;
                case 'share': score += 3; break;
                case 'follow': score += 4; break;
                case 'chat': score += 2; break;
            }
        }
    });

    stream.tags && stream.tags.length > 0 && stream.tags?.forEach(tag => {
        if (userMetrics.some(metric => metric.stream_tags.some(stag => stag.value === tag.value))) {
            score += 5;
        }
    });

    score += Math.log1p(stream.viewers);

    return score;
}

async function recommendStreams(userMetrics: UserMetric[], streams: Stream[], count: number): Promise<Stream[]> {
    const scoredStreams = streams.map(stream => ({
        ...stream,
        score: getStreamScore(userMetrics, stream)
    }));

    return scoredStreams.sort((a, b) => {
        if (a.is_live === b.is_live) {
            return b.score - a.score;
        }

        return (b.is_live ? 1 : 0) - (a.is_live ? 1 : 0);
    }).slice(0, count);
}

export { recommendStreams };
export type { Stream, UserMetric };
