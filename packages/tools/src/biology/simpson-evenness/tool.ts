import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SimpsonEvennessInput = {
  readonly dIndex: number;
  readonly speciesCountInt: number;
};

export type SimpsonEvennessOutput = {
  readonly simpsonEvenness: number;
};

export const simpsonEvennessExample = {
  input: { dIndex: 0.25, speciesCountInt: 4 },
  output: { simpsonEvenness: 1 },
} satisfies ToolExample<SimpsonEvennessInput, SimpsonEvennessOutput>;

export const simpsonEvennessTool = createSimpleTool({
  id: "biology/simpson-evenness",
  title: "Simpson Evenness",
  description:
    "Compute Simpson evenness as (1 / D) divided by species count from a Simpson concentration index strictly between zero and one.",
  inputs: [
    {
      id: "dIndex",
      kind: "number",
      label: "Simpson index",
    },
    {
      id: "speciesCountInt",
      kind: "integer",
      label: "Species count",
      minimum: 1,
      unit: "species",
    },
  ],
  outputs: [
    {
      id: "simpsonEvenness",
      kind: "number",
      label: "Simpson evenness",
    },
  ],
  calculate: (input) => {
    const dIndex = input.dIndex as number;
    if (!(dIndex > 0 && dIndex < 1))
      simpleError(
        "dIndex",
        "The Simpson concentration must lie strictly between zero and one.",
        "invalid_index",
      );
    return {
      simpsonEvenness: 1 / dIndex / (input.speciesCountInt as number),
    };
  },
});
export const runSimpsonEvenness = simpsonEvennessTool.execute;
export default simpsonEvennessTool;
