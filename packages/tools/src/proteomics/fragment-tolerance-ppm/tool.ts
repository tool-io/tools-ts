import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly fragmentMz: number;
  readonly toleranceDa: number;
}>;
export type Output = Readonly<{
  readonly tolerancePpm: number;
}>;
export const calculate = (input: Input): Output => {
  if (input.fragmentMz <= 0 || input.toleranceDa < 0)
    simpleError(
      "fragmentMz",
      "Positive fragment mass and nonnegative Dalton tolerance required.",
    );
  return { tolerancePpm: (input.toleranceDa / input.fragmentMz) * 1e6 };
};
export const exampleInput = {
  fragmentMz: 500,
  toleranceDa: 0.01,
} satisfies Input;
export const exampleOutput = { tolerancePpm: 20 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "proteomics/fragment-tolerance-ppm",
  title: "Fragment Tolerance PPM",
  description: "Convert a fragment mass tolerance from daltons to ppm.",
  inputs: [
    { id: "fragmentMz", label: "Fragment mz", kind: "number" },
    { id: "toleranceDa", label: "Tolerance da", kind: "number" },
  ],
  outputs: [{ id: "tolerancePpm", label: "Tolerance ppm", kind: "number" }],
  calculate: (value) =>
    calculate({
      fragmentMz: value.fragmentMz as number,
      toleranceDa: value.toleranceDa as number,
    }),
});
export const run = tool.execute;
export default tool;
