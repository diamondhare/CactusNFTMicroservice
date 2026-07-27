import { randomInt as secureRandomInt } from 'node:crypto';
import { AbiCoder, keccak256 } from 'ethers';

export const CACTUS_TRAITS_V1 = {
  bodyShape: {
    Globular: 0,
    ShortColumnar: 1,
    Columnar: 2,
    Barrel: 3,
    Clumping: 4,
    Depressed: 5,
    Segmented: 6,
    Tuberculate: 7,
    CrestedTendency: 8,
    MonstroseTendency: 9,
    Spiral: 10,
    Flattened: 11,
    Irregular: 12,
  },
  ribCount: {
    VeryLow: 0,
    Low: 1,
    Medium: 2,
    High: 3,
    VeryHigh: 4,
    Extreme: 5,
    Irregular: 6,
  },
  epidermisColor: {
    DarkGreen: 0,
    BlueGreen: 1,
    GreyGreen: 2,
    Olive: 3,
    PurpleTint: 4,
    Bronze: 5,
    YellowVariegated: 6,
    WhiteVariegated: 7,
    RedStressTint: 8,
    Grey: 9,
  },
  spineLength: {
    None: 0,
    VeryShort: 1,
    Short: 2,
    Medium: 3,
    Long: 4,
    VeryLong: 5,
    Extreme: 6,
  },
  spineDensity: {
    None: 0,
    Sparse: 1,
    Medium: 2,
    Dense: 3,
    VeryDense: 4,
    WoolCovered: 5,
  },
  spineColor: {
    White: 0,
    Cream: 1,
    Yellow: 2,
    Golden: 3,
    Brown: 4,
    Black: 5,
    Red: 6,
    DarkPurple: 7,
  },
  areoleSize: { Tiny: 0, Small: 1, Medium: 2, Large: 3, Huge: 4 },
  woolAmount: { None: 0, Low: 1, Medium: 2, High: 3, Extreme: 4 },
  flowerColor: {
    White: 0,
    Pink: 1,
    Yellow: 2,
    Red: 3,
    Purple: 4,
    Orange: 5,
    Multicolor: 6,
    RareBiColor: 7,
  },
  growthSpeed: { VerySlow: 0, Slow: 1, Medium: 2, Fast: 3, VeryFast: 4 },
  rotResistance: { VeryLow: 0, Low: 1, Medium: 2, High: 3, VeryHigh: 4 },
  offsetRate: { None: 0, Rare: 1, Low: 2, Medium: 3, High: 4, Aggressive: 5 },
} as const;

export const CACTUS_TRAIT_ORDER_V1 = [
  'bodyShape',
  'ribCount',
  'epidermisColor',
  'spineLength',
  'spineDensity',
  'spineColor',
  'areoleSize',
  'woolAmount',
  'flowerColor',
  'growthSpeed',
  'rotResistance',
  'offsetRate',
] as const;

export type CactusTraitKeyV1 = (typeof CACTUS_TRAIT_ORDER_V1)[number];
export type CactusAllelesV1 = {
  dominant: string;
  recessive1: string;
  recessive2: string;
};
export type CactusGenomeInputV1 = Record<CactusTraitKeyV1, CactusAllelesV1> & {
  variegationLevel: number;
  monstroseLevel: number;
  cresting: boolean;
  dichotomous: boolean;
  mutationLuck: number;
  speciesClass: number;
  generation: number;
  genomeVersion: number;
};

export type PackedCactusGenomeV1 = {
  genomeBigInt: bigint;
  genomeHex: string;
  traits: CactusGenomeInputV1;
};

export type BreedCactusGenomeInputV1 = {
  parentAGenome: bigint;
  parentBGenome: bigint;
  parentAGeneration: number;
  parentBGeneration: number;
  salt: string;
};

export type BreedCactusGenomeResultV1 = PackedCactusGenomeV1 & {
  generation: number;
  entropy: string;
};

const abiCoder = AbiCoder.defaultAbiCoder();

export function generateRandomGen1CactusGenome(): PackedCactusGenomeV1 {
  const traits = {} as CactusGenomeInputV1;

  for (const trait of CACTUS_TRAIT_ORDER_V1) {
    const alleles = Object.keys(CACTUS_TRAITS_V1[trait]);
    traits[trait] = {
      dominant: randomItem(alleles),
      recessive1: randomItem(alleles),
      recessive2: randomItem(alleles),
    };
  }

  traits.variegationLevel = secureRandomInt(0, 16);
  traits.monstroseLevel = secureRandomInt(0, 16);
  traits.cresting = secureRandomInt(0, 2) === 1;
  traits.dichotomous = secureRandomInt(0, 2) === 1;
  traits.mutationLuck = secureRandomInt(0, 16);
  traits.speciesClass = secureRandomInt(1, 7);
  traits.generation = 1;
  traits.genomeVersion = 1;

  return packCactusGenomeV1(traits);
}

export function packCactusGenomeV1(
  traits: CactusGenomeInputV1,
): PackedCactusGenomeV1 {
  let genome = 0n;
  let bitCursor = 0n;

  for (const trait of CACTUS_TRAIT_ORDER_V1) {
    const mapping = CACTUS_TRAITS_V1[trait] as Record<string, number>;
    const alleles = traits[trait];
    const dominant = encodeAllele(mapping, alleles.dominant, trait);
    const recessive1 = encodeAllele(mapping, alleles.recessive1, trait);
    const recessive2 = encodeAllele(mapping, alleles.recessive2, trait);
    const traitBits = (dominant << 8) | (recessive1 << 4) | recessive2;
    genome |= BigInt(traitBits) << bitCursor;
    bitCursor += 12n;
  }

  const writeBits = (value: number, bits: number, name: string) => {
    if (!Number.isInteger(value) || value < 0 || value >= 2 ** bits) {
      throw new Error(`${name} must fit into ${bits} bits`);
    }
    genome |= BigInt(value) << bitCursor;
    bitCursor += BigInt(bits);
  };

  writeBits(traits.variegationLevel, 4, 'variegationLevel');
  writeBits(traits.monstroseLevel, 4, 'monstroseLevel');
  writeBits(traits.cresting ? 1 : 0, 1, 'cresting');
  writeBits(traits.dichotomous ? 1 : 0, 1, 'dichotomous');
  writeBits(traits.mutationLuck, 4, 'mutationLuck');
  writeBits(traits.speciesClass, 8, 'speciesClass');
  writeBits(traits.generation, 8, 'generation');
  writeBits(traits.genomeVersion, 8, 'genomeVersion');

  return {
    genomeBigInt: genome,
    genomeHex: `0x${genome.toString(16).padStart(64, '0')}`,
    traits,
  };
}

export function decodeCactusGenomeV1(genome: bigint): CactusGenomeInputV1 {
  let bitCursor = 0n;
  const traits = {} as CactusGenomeInputV1;

  for (const trait of CACTUS_TRAIT_ORDER_V1) {
    const raw = Number((genome >> bitCursor) & 0xfffn);
    const reverse = reverseTrait(CACTUS_TRAITS_V1[trait]);
    traits[trait] = {
      dominant: requireAllele(reverse, (raw >> 8) & 0xf, trait),
      recessive1: requireAllele(reverse, (raw >> 4) & 0xf, trait),
      recessive2: requireAllele(reverse, raw & 0xf, trait),
    };
    bitCursor += 12n;
  }

  const readBits = (bits: number) => {
    const value = Number((genome >> bitCursor) & ((1n << BigInt(bits)) - 1n));
    bitCursor += BigInt(bits);
    return value;
  };

  traits.variegationLevel = readBits(4);
  traits.monstroseLevel = readBits(4);
  traits.cresting = readBits(1) === 1;
  traits.dichotomous = readBits(1) === 1;
  traits.mutationLuck = readBits(4);
  traits.speciesClass = readBits(8);
  traits.generation = readBits(8);
  traits.genomeVersion = readBits(8);
  return traits;
}

export function breedCactusGenomeV1(
  input: BreedCactusGenomeInputV1,
): BreedCactusGenomeResultV1 {
  const entropy = keccak256(
    abiCoder.encode(
      ['uint256', 'uint256', 'uint32', 'uint32', 'string'],
      [
        input.parentAGenome,
        input.parentBGenome,
        input.parentAGeneration,
        input.parentBGeneration,
        input.salt,
      ],
    ),
  );
  const parentA = decodeCactusGenomeV1(input.parentAGenome);
  const parentB = decodeCactusGenomeV1(input.parentBGenome);
  const generation =
    Math.max(input.parentAGeneration, input.parentBGeneration) + 1;
  const child = {} as CactusGenomeInputV1;

  for (const trait of CACTUS_TRAIT_ORDER_V1) {
    child[trait] = inheritTrait(trait, parentA[trait], parentB[trait], entropy);
  }

  child.variegationLevel = inheritNumber(
    parentA.variegationLevel,
    parentB.variegationLevel,
    entropy,
    'variegationLevel',
  );
  child.monstroseLevel = inheritNumber(
    parentA.monstroseLevel,
    parentB.monstroseLevel,
    entropy,
    'monstroseLevel',
  );
  child.cresting = inheritBoolean(
    parentA.cresting,
    parentB.cresting,
    entropy,
    'cresting',
  );
  child.dichotomous = inheritBoolean(
    parentA.dichotomous,
    parentB.dichotomous,
    entropy,
    'dichotomous',
  );
  child.mutationLuck = inheritNumber(
    parentA.mutationLuck,
    parentB.mutationLuck,
    entropy,
    'mutationLuck',
  );
  child.speciesClass = chooseOne(
    parentA.speciesClass,
    parentB.speciesClass,
    entropy,
    'speciesClass',
  );
  child.generation = generation;
  child.genomeVersion = Math.max(parentA.genomeVersion, parentB.genomeVersion);

  return { ...packCactusGenomeV1(child), generation, entropy };
}

function inheritTrait(
  trait: CactusTraitKeyV1,
  parentA: CactusAllelesV1,
  parentB: CactusAllelesV1,
  entropy: string,
): CactusAllelesV1 {
  const alleleFromA = chooseParentAllele(parentA, entropy, `${trait}:gamete:a`);
  const alleleFromB = chooseParentAllele(parentB, entropy, `${trait}:gamete:b`);
  const dominantFromA =
    deterministicInt(entropy, `${trait}:dominance`, 10_000) < 5_000;
  return {
    dominant: dominantFromA ? alleleFromA : alleleFromB,
    recessive1: dominantFromA ? alleleFromB : alleleFromA,
    recessive2: chooseOne(
      chooseParentAllele(parentA, entropy, `${trait}:reserve:a`),
      chooseParentAllele(parentB, entropy, `${trait}:reserve:b`),
      entropy,
      `${trait}:reserve`,
    ),
  };
}

function chooseParentAllele(
  alleles: CactusAllelesV1,
  entropy: string,
  nonce: string,
): string {
  const roll = deterministicInt(entropy, nonce, 10_000);
  if (roll < 5_000) return alleles.dominant;
  if (roll < 8_000) return alleles.recessive1;
  return alleles.recessive2;
}

function inheritNumber(
  parentA: number,
  parentB: number,
  entropy: string,
  nonce: string,
): number {
  const min = Math.min(parentA, parentB);
  const max = Math.max(parentA, parentB);
  return min === max
    ? min
    : min + deterministicInt(entropy, nonce, max - min + 1);
}

function inheritBoolean(
  parentA: boolean,
  parentB: boolean,
  entropy: string,
  nonce: string,
): boolean {
  return parentA === parentB
    ? parentA
    : deterministicInt(entropy, nonce, 10_000) < 5_000;
}

function chooseOne<T>(
  parentA: T,
  parentB: T,
  entropy: string,
  nonce: string,
): T {
  return deterministicInt(entropy, nonce, 2) === 0 ? parentA : parentB;
}

function deterministicInt(
  entropy: string,
  nonce: string,
  modulo: number,
): number {
  const value = BigInt(
    keccak256(abiCoder.encode(['bytes32', 'string'], [entropy, nonce])),
  );
  return Number(value % BigInt(modulo));
}

function randomItem<T>(values: readonly T[]): T {
  if (values.length === 0)
    throw new Error('Cannot select from an empty trait list');
  return values[secureRandomInt(0, values.length)];
}

function encodeAllele(
  mapping: Record<string, number>,
  allele: string,
  trait: string,
): number {
  const value = mapping[allele];
  if (value === undefined)
    throw new Error(`Invalid allele "${allele}" for trait "${trait}"`);
  if (value > 15) throw new Error(`Allele value for "${trait}" exceeds 4 bits`);
  return value;
}

function reverseTrait(mapping: Record<string, number>): Record<number, string> {
  return Object.fromEntries(
    Object.entries(mapping).map(([name, value]) => [value, name]),
  );
}

function requireAllele(
  reverse: Record<number, string>,
  value: number,
  trait: string,
): string {
  const allele = reverse[value];
  if (allele === undefined)
    throw new Error(
      `Genome contains unknown allele ${value} for trait "${trait}"`,
    );
  return allele;
}
