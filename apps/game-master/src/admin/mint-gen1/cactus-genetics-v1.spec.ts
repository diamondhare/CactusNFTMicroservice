import {
  CACTUS_TRAIT_ORDER_V1,
  CACTUS_TRAITS_V1,
  breedCactusGenomeV1,
  decodeCactusGenomeV1,
  generateRandomGen1CactusGenome,
} from '@app/blockchain';

describe('Cactus genetics V1', () => {
  it('generates valid packed Gen1 traits', () => {
    for (let index = 0; index < 32; index += 1) {
      const generated = generateRandomGen1CactusGenome();
      expect(generated.genomeHex).toMatch(/^0x[0-9a-f]{64}$/);
      const decoded = decodeCactusGenomeV1(generated.genomeBigInt);
      expect(decoded).toEqual(generated.traits);
      expect(decoded.generation).toBe(1);
      expect(decoded.genomeVersion).toBe(1);

      for (const trait of CACTUS_TRAIT_ORDER_V1) {
        const validAlleles = Object.keys(CACTUS_TRAITS_V1[trait]);
        expect(validAlleles).toContain(decoded[trait].dominant);
        expect(validAlleles).toContain(decoded[trait].recessive1);
        expect(validAlleles).toContain(decoded[trait].recessive2);
      }
    }
  });

  it('breeds deterministically and increments the highest parent generation', () => {
    const parentA = generateRandomGen1CactusGenome();
    const parentB = generateRandomGen1CactusGenome();
    const input = {
      parentAGenome: parentA.genomeBigInt,
      parentBGenome: parentB.genomeBigInt,
      parentAGeneration: 2,
      parentBGeneration: 4,
      salt: 'deterministic-test-salt',
    };

    const first = breedCactusGenomeV1(input);
    const second = breedCactusGenomeV1(input);
    expect(first).toEqual(second);
    expect(first.generation).toBe(5);
    expect(first.traits.generation).toBe(5);
    expect(decodeCactusGenomeV1(first.genomeBigInt)).toEqual(first.traits);
  });
});
