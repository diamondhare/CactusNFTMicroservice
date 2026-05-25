import { CloseForBreedingAction } from "../src/actions/close-from-breeding.action";
import { OpenForBreedingAction } from "../src/actions/open-for-breeding.action";
import { SetBotIdle } from "../src/actions/set-bot-idle.action";
import { TransferAction } from "../src/actions/transfer.action";

export type BotActionImplementation = TransferAction | OpenForBreedingAction | CloseForBreedingAction | SetBotIdle;