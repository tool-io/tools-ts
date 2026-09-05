import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch41-shared.js";
export type Input = Readonly<{ readonly metricCarats: number }>;
export type Output = Readonly<{ readonly grams: number }>;
const inputFields = [
  { id: "metricCarats", label: "Metric carats", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.metricCarats, "metricCarats");
  return { grams: input.metricCarats * 0.2 };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { metricCarats: 2 } satisfies Input;
export const exampleOutput = { grams: 0.4 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/carat-to-gram",
  title: "Carat to Gram Converter",
  description:
    "Metric carat=.2 gram by definition. Caller independently establishes geometry, assay, calibration and protocol; not material identity, laboratory grade, treatment or care safety.",
  inputs: inputFields,
  outputs: [{ id: "grams", label: "Grams", kind: "number" }],
  calculate: (value) =>
    calculate({ metricCarats: value.metricCarats as number }),
});
export const run = tool.execute;
export default tool;
