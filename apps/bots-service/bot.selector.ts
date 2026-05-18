import { Injectable } from "@nestjs/common";
import { BotContext } from "./src/bot.context";
import { weightedRandom } from "@app/common/utils/weighted-random";
import { TransferAction } from "./src/actions/transfer.action";
import { OpenForBreedingAction } from "./src/actions/open-for-breeding.action";
import { CloseForBreedingAction } from "./src/actions/close-from-breeding.action";

@Injectable()
export class BotActionSelector {
    constructor(
        private readonly transferAction: TransferAction,
        private readonly openForBreedingAction: OpenForBreedingAction,
        private readonly closeForBreedingAction: CloseForBreedingAction,
    ) {}

    async selectAction(context: BotContext): Promise<TransferAction | OpenForBreedingAction | CloseForBreedingAction> {
        const actions = [this.transferAction, this.openForBreedingAction, this.closeForBreedingAction];

        const executableActions = actions.filter(action => action.canExecute(context));

        const availableActions = await Promise.all(executableActions.map(async action => ({ action, weight: await action.getWeight(context) })));

        return weightedRandom(availableActions);
    }
}
