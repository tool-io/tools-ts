import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch41-shared.js";
export type Input = Readonly<{ readonly metricCarats: number }>;
export type Output = Readonly<{ readonly pearlGrains: number }>;
const inputFields = [
  { id: "metricCarats", label: "Metric carats", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.metricCarats, "metricCarats");
  return { pearlGrains: input.metricCarats * 4 };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { metricCarats: 2 } satisfies Input;
export const exampleOutput = { pearlGrains: 8 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/carat-to-grain-pearl",
  title: "Carat to Grain Pearl Weight Converter",
  description:
    "Pearl grain convention=.05 gram, four per metric carat, not avoirdupois grain. Caller independently establishes geometry, assay, calibration and protocol; not material identity, laboratory grade, treatment or care safety.",
  inputs: inputFields,
  outputs: [{ id: "pearlGrains", label: "Pearl grains", kind: "number" }],
  calculate: (value) =>
    calculate({ metricCarats: value.metricCarats as number }),
});
export const run = tool.execute;
export default tool;
