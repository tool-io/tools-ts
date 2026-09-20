import { simpleError } from "../core/simple.js";
import type { GeneratorRandom } from "./generator-random.js";
export const constructPlantedSetFamily = (
  universeSize: number,
  setCount: number,
  plantedCount: number,
  inclusion: number,
  random: GeneratorRandom,
): { universe: number[]; subsets: number[][]; witnessIndices: number[] } => {
  if (plantedCount > universeSize || plantedCount > setCount)
    return simpleError(
      "plantedSetCount",
      "The nonempty planted partition must fit the universe and set count.",
      "infeasible_partition",
    );
  const universe = Array.from({ length: universeSize }, (_, i) => i);
  const shuffled = random.shuffle(universe),
    subsets: number[][] = Array.from({ length: plantedCount }, () => []);
  shuffled.forEach((value, i) =>
    subsets[i < plantedCount ? i : random.integer(0, plantedCount - 1)].push(
      value,
    ),
  );
  for (const subset of subsets) subset.sort((a, b) => a - b);
  while (subsets.length < setCount) {
    const subset = universe.filter(() => random.unit() < inclusion);
    if (!subset.length) subset.push(random.pick(universe));
    subsets.push(subset);
  }
  return {
    universe,
    subsets,
    witnessIndices: Array.from({ length: plantedCount }, (_, i) => i),
  };
};
