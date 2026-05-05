import 'reflect-metadata';
import { Contract, JsonRpcProvider, Wallet } from 'ethers';
import {
  signBreedAction,
  signGerminationAction,
} from '@app/blockchain/signing/cactus-game-signatures';

const BREEDING_ABI = [
  'function breedingNonces(address account) view returns (uint256)',
];
const GERMINATION_ABI = [
  'function germinationNonces(address account) view returns (uint256)',
];

type Args = Record<string, string>;

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const action = args.action;
  const rpcUrl = args.rpcUrl ?? process.env.HARDHAT_RPC_URL ?? 'http://127.0.0.1:8545';
  const privateKey = args.privateKey ?? process.env.GAME_MASTER_PRIVATE_KEY;

  if (privateKey === undefined || privateKey.length === 0) {
    throw new Error('Missing --private-key or GAME_MASTER_PRIVATE_KEY');
  }

  const provider = new JsonRpcProvider(rpcUrl);
  const wallet = new Wallet(privateKey, provider);
  const chainId = (await provider.getNetwork()).chainId;

  if (action === 'breed') {
    const breedingAddress =
      args.breedingContract ?? process.env.CACTUS_BREEDING_ADDRESS;
    const breeder = requireArg(args, 'breeder');
    const parentA = BigInt(requireArg(args, 'parentA'));
    const parentB = BigInt(requireArg(args, 'parentB'));
    const childGenome = BigInt(requireArg(args, 'childGenome'));
    const deadline = BigInt(requireArg(args, 'deadline'));

    if (breedingAddress === undefined || breedingAddress.length === 0) {
      throw new Error('Missing --breeding-contract or CACTUS_BREEDING_ADDRESS');
    }

    const breeding = new Contract(breedingAddress, BREEDING_ABI, provider);
    const nonce = (await breeding.breedingNonces(breeder)) as bigint;
    const signature = await signBreedAction(wallet, {
      chainId,
      breedingContract: breedingAddress,
      breeder,
      parentA,
      parentB,
      childGenome,
      nonce,
      deadline,
    });

    printResult({
      action,
      signer: wallet.address,
      chainId: chainId.toString(),
      breedingContract: breedingAddress,
      breeder,
      parentA: parentA.toString(),
      parentB: parentB.toString(),
      childGenome: childGenome.toString(),
      nonce: nonce.toString(),
      deadline: deadline.toString(),
      signature,
    });
    return;
  }

  if (action === 'germination') {
    const germinationAddress =
      args.germinationContract ?? process.env.CACTUS_GERMINATION_ADDRESS;
    const owner = requireArg(args, 'owner');
    const seedId = BigInt(requireArg(args, 'seedId'));
    const deadline = BigInt(requireArg(args, 'deadline'));

    if (germinationAddress === undefined || germinationAddress.length === 0) {
      throw new Error(
        'Missing --germination-contract or CACTUS_GERMINATION_ADDRESS',
      );
    }

    const germination = new Contract(
      germinationAddress,
      GERMINATION_ABI,
      provider,
    );
    const nonce = (await germination.germinationNonces(owner)) as bigint;
    const signature = await signGerminationAction(wallet, {
      chainId,
      germinationContract: germinationAddress,
      owner,
      seedId,
      nonce,
      deadline,
    });

    printResult({
      action,
      signer: wallet.address,
      chainId: chainId.toString(),
      germinationContract: germinationAddress,
      owner,
      seedId: seedId.toString(),
      nonce: nonce.toString(),
      deadline: deadline.toString(),
      signature,
    });
    return;
  }

  throw new Error('Use --action breed or --action germination');
}

function parseArgs(argv: string[]): Args {
  const result: Args = {};

  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];

    if (key?.startsWith('--') && value !== undefined) {
      result[toCamelCase(key.slice(2))] = value;
    }
  }

  return result;
}

function requireArg(args: Args, name: string): string {
  const value = args[name];

  if (value === undefined || value.length === 0) {
    throw new Error(`Missing --${toKebabCase(name)}`);
  }

  return value;
}

function printResult(result: Record<string, string>) {
  console.log(JSON.stringify(result, null, 2));
}

function toCamelCase(value: string): string {
  return value.replace(/-([a-z])/g, (_, char: string) => char.toUpperCase());
}

function toKebabCase(value: string): string {
  return value.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`);
}

void main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
