import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly observedPeptides: number;
  readonly observablePeptides: number;
}>;
export type Output = Readonly<{
  readonly pai: number;
  readonly empai: number;
}>;
export const calculate = (input: Input): Output => {
  if (
    !Number.isSafeInteger(input.observedPeptides) ||
    !Number.isSafeInteger(input.observablePeptides) ||
    input.observedPeptides < 0 ||
    input.observablePeptides <= 0 ||
    input.observedPeptides > input.observablePeptides
  )
    simpleError(
      "observablePeptides",
      "Observed peptide count must not exceed positive observable count.",
    );
  const pai = input.observedPeptides / input.observablePeptides;
  return { pai, empai: 10 ** pai - 1 };
};
export const exampleInput = {
  observedPeptides: 3,
  observablePeptides: 6,
} satisfies Input;
export const exampleOutput = {
  pai: 0.5,
  empai: 2.1622776601683795,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/empai-abundance",
  title: "EMPAI Abundance",
  description:
    "Calculate exponentially modified protein abundance index from peptide counts.",
  inputs: [
    { id: "observedPeptides", label: "Observed peptides", kind: "number" },
    { id: "observablePeptides", label: "Observable peptides", kind: "number" },
  ],
  outputs: [
    { id: "pai", label: "Pai", kind: "number" },
    { id: "empai", label: "Empai", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedPeptides: value.observedPeptides as number,
      observablePeptides: value.observablePeptides as number,
    }),
});
export const run = tool.execute;
export default tool;
