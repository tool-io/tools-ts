import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch41-shared.js";
export type Input = Readonly<{ readonly metricCarats: number }>;
export type Output = Readonly<{ readonly caratPoints: number }>;
const inputFields = [
  { id: "metricCarats", label: "Metric carats", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  nonnegative(input.metricCarats, "metricCarats");
  return { caratPoints: input.metricCarats * 100 };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = { metricCarats: 2 } satisfies Input;
export const exampleOutput = { caratPoints: 200 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/carat-to-point",
  title: "Carat to Point Converter",
  description:
    "One metric carat=100 carat points, not pearl grains. Caller independently establishes geometry, assay, calibration and protocol; not material identity, laboratory grade, treatment or care safety.",
  inputs: inputFields,
  outputs: [{ id: "caratPoints", label: "Carat points", kind: "number" }],
  calculate: (value) =>
    calculate({ metricCarats: value.metricCarats as number }),
});
export const run = tool.execute;
export default tool;
