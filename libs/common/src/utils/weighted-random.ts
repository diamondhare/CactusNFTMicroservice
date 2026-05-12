
    export type WeightedAction<T> = {
        action: T;
        weight: number;
    };

    export function weightedRandom<T>(actionPayload: WeightedAction<T>[]): number {
        const totalWeight = actionPayload.reduce((sum, action) => sum + action.weight, 0);
        const randomWeight = Math.random() * totalWeight;
        let cumulativeWeight = 0;
        for (const action of actionPayload) {
            cumulativeWeight += action.weight;
            if (randomWeight <= cumulativeWeight) {
                return actionPayload.indexOf(action);
            }
        }
        return actionPayload.length - 1;
    }