import { Injectable, Logger } from "@nestjs/common";
import { weightedRandom } from "@app/common/utils/weighted-random";
import { TransferAction } from "../bots-service/src/actions/transfer.action";
import { OpenForBreedingAction } from "../bots-service/src/actions/open-for-breeding.action";
import { CloseForBreedingAction } from "../bots-service/src/actions/close-from-breeding.action";
import { BotContext } from "./types/bot-context.types";
import { BotActionImplementation } from "./types/bot-actions.types";
import { SetBotIdle } from "./src/actions/set-bot-idle.action";

@Injectable()
export class BotActionSelector {
    private readonly logger = new Logger(BotActionSelector.name);
    constructor(
        private readonly transferAction: TransferAction,
        private readonly setBotIdleAction: SetBotIdle,
        private readonly openForBreedingAction: OpenForBreedingAction,
        private readonly closeForBreedingAction: CloseForBreedingAction,
    ) {}

    async selectAction(context: BotContext): Promise<BotActionImplementation> {
        this.logger.log(`In action selector`)
        const actions = [this.transferAction, this.openForBreedingAction, this.closeForBreedingAction, this.setBotIdleAction];
        const executableActions = await Promise.all(actions.map(async action => ({ action, executable: await action.canExecute(context), weight: await action.getWeight(context) })));
        this.logger.log(`${executableActions.map(action => action.action.type)}`);
        const filteredActions = executableActions.filter(action => action.executable === true);
        this.logger.log(`filtered: ${filteredActions.map(action => action.action.type)}`);
        return weightedRandom(filteredActions);
    }
}
