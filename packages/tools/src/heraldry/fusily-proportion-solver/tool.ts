import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  simpleError,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly fusilLongDiagonal: number;
  readonly fusilShortDiagonal: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "fusilLongDiagonal", label: "Fusil long diagonal", kind: "number" },
  { id: "fusilShortDiagonal", label: "Fusil short diagonal", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.fusilLongDiagonal, "fusilLongDiagonal");
  positive(input.fusilShortDiagonal, "fusilShortDiagonal");
  if (input.fusilLongDiagonal < input.fusilShortDiagonal)
    simpleError("diagonals", "Declared long diagonal not shorter.");
  return {
    elongationRatio: input.fusilLongDiagonal / input.fusilShortDiagonal,
    cellArea: (input.fusilLongDiagonal * input.fusilShortDiagonal) / 2,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { fusilLongDiagonal: 40, fusilShortDiagonal: 10 },
  output: { result: { elongationRatio: 4, cellArea: 200 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/fusily-proportion-solver",
  title: "Fusily elongated Lattice Proportion Solver",
  description:
    "Actual fusil elongation and ideal diamond-cell area; no universal fusily-vs-lozengy cutoff.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
