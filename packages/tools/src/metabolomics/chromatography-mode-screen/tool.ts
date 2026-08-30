import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly polarityIndex: number;
  readonly hilicMinimum: number;
  readonly rpMaximum: number;
}>;
export type Output = Readonly<{
  readonly suggestedMode: string;
  readonly selectionMargin: number;
}>;
export const calculate = (input: Input): Output => {
  if (input.hilicMinimum < input.rpMaximum)
    simpleError(
      "hilicMinimum",
      "HILIC threshold must not be below RP threshold.",
    );
  return {
    suggestedMode:
      input.polarityIndex >= input.hilicMinimum
        ? "HILIC"
        : input.polarityIndex <= input.rpMaximum
          ? "RP"
          : "mixed",
    selectionMargin: input.polarityIndex - input.hilicMinimum,
  };
};
export const exampleInput = {
  polarityIndex: 0.8,
  hilicMinimum: 0.7,
  rpMaximum: 0.3,
} satisfies Input;
export const exampleOutput = {
  suggestedMode: "HILIC",
  selectionMargin: 0.10000000000000009,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "metabolomics/chromatography-mode-screen",
  title: "Chromatography Mode Screen",
  description:
    "Screen chromatography mode from caller-defined polarity boundaries.",
  inputs: [
    { id: "polarityIndex", kind: "number", label: "Polarity index" },
    { id: "hilicMinimum", kind: "number", label: "Hilic minimum" },
    { id: "rpMaximum", kind: "number", label: "Rp maximum" },
  ],
  outputs: [
    { id: "suggestedMode", kind: "string", label: "Suggested mode" },
    { id: "selectionMargin", kind: "number", label: "Selection margin" },
  ],
  calculate: (value) =>
    calculate({
      polarityIndex: value.polarityIndex as number,
      hilicMinimum: value.hilicMinimum as number,
      rpMaximum: value.rpMaximum as number,
    }),
});
export const run = tool.execute;
export default tool;
