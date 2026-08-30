import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, bounded } from "../batch-shared.js";
export type Input = Readonly<{
  readonly referenceRadius: number;
  readonly radialExponentialRate: number;
  readonly startAngleRadians: number;
  readonly endAngleRadians: number;
}>;
export type Output = Readonly<{ readonly spiralSegmentLength: number }>;
const inputFields = [
  { id: "referenceRadius", label: "Reference radius", kind: "number" },
  {
    id: "radialExponentialRate",
    label: "Radial exponential rate",
    kind: "number",
  },
  { id: "startAngleRadians", label: "Start angle radians", kind: "number" },
  { id: "endAngleRadians", label: "End angle radians", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.referenceRadius, "referenceRadius");
  if (
    input.endAngleRadians < input.startAngleRadians ||
    Math.abs(input.radialExponentialRate) > 100
  )
    simpleError(
      "parameters",
      "Ordered angles and bounded exponential rate required.",
    );
  const b = input.radialExponentialRate,
    span = input.endAngleRadians - input.startAngleRadians,
    r = input.referenceRadius * Math.exp(b * input.startAngleRadians);
  return {
    spiralSegmentLength:
      b === 0 ? r * span : (r * Math.hypot(1, b) * Math.expm1(b * span)) / b,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  referenceRadius: 1,
  radialExponentialRate: 1,
  startAngleRadians: 0,
  endAngleRadians: 1,
} satisfies Input;
export const exampleOutput = {
  spiralSegmentLength: 2.4300174657860216,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "math/logarithmic-spiral-length",
  title: "Logarithmic Spiral Length Calculator",
  description:
    "Compute logarithmic spiral segment length for r=a exp(bθ), retaining shrinking spirals and exact b=0 circular limit; finite output bounds exponential overflow.",
  inputs: inputFields,
  outputs: [
    {
      id: "spiralSegmentLength",
      label: "Spiral segment length",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      referenceRadius: value.referenceRadius as number,
      radialExponentialRate: value.radialExponentialRate as number,
      startAngleRadians: value.startAngleRadians as number,
      endAngleRadians: value.endAngleRadians as number,
    }),
});
export const run = tool.execute;
export default tool;
