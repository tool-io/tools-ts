import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const diversitySimpsonIndexExample = {
  input: { speciesACount: 2, speciesBCount: 2, speciesCCount: 2 },
} satisfies ToolExample<{
  readonly speciesACount: number;
  readonly speciesBCount: number;
  readonly speciesCCount: number;
}>;

export const diversitySimpsonIndexTool = createSimpleTool({
  id: "biology/diversity-simpson-index",
  title: "Simpson Index D",
  description:
    "Compute the Simpson diversity index D for three species counts in a sample.",
  inputs: [
    {
      id: "speciesACount",
      label: "Species A count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "speciesBCount",
      label: "Species B count",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "speciesCCount",
      label: "Species C count",
      kind: "integer",
      minimum: 0,
    },
  ],
  outputs: [{ id: "simpsonIndexD", label: "Simpson index D", kind: "number" }],
  calculate: (input) => {
    const speciesACount = input.speciesACount as number;
    const speciesBCount = input.speciesBCount as number;
    const speciesCCount = input.speciesCCount as number;
    const total = speciesACount + speciesBCount + speciesCCount;
    if (total <= 1)
      simpleError(
        "speciesACount",
        "At least two individuals are required.",
        "insufficient_samples",
      );
    return {
      simpsonIndexD:
        (speciesACount * (speciesACount - 1) +
          speciesBCount * (speciesBCount - 1) +
          speciesCCount * (speciesCCount - 1)) /
        (total * (total - 1)),
    };
  },
});
export const runDiversitySimpsonIndex = diversitySimpsonIndexTool.execute;
export default diversitySimpsonIndexTool;
