export interface BotActionInterface {
    type: string;

    canExecute(context: any): Promise<boolean>;

    getWeight(context: any): Promise<number>;

    execute(context: any): Promise<void>;
}