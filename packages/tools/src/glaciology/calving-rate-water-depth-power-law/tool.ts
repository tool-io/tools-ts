import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly waterDepthsM: readonly number[];
  readonly calibratedCoefficient: number;
  readonly depthExponent: number;
  readonly referenceDepthM: number;
}>;
export type Output = Readonly<{
  readonly predictedCalvingSpeedsMPerYear: readonly number[];
}>;
const inputFields = [
  { id: "waterDepthsM", label: "Water depths m", kind: "numberList" },
  {
    id: "calibratedCoefficient",
    label: "Calibrated coefficient",
    kind: "number",
  },
  { id: "depthExponent", label: "Depth exponent", kind: "number" },
  { id: "referenceDepthM", label: "Reference depth m", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.depthExponent, "depthExponent");
  positive(input.referenceDepthM, "referenceDepthM");
  input.waterDepthsM.forEach((v) => nonnegative(v, "waterDepthsM"));
  nonnegative(input.calibratedCoefficient, "calibratedCoefficient");
  if (!input.waterDepthsM.length)
    simpleError("waterDepthsM", "Nonempty water depths required.");
  return {
    predictedCalvingSpeedsMPerYear: input.waterDepthsM.map(
      (d) =>
        input.calibratedCoefficient *
        (d / input.referenceDepthM) ** input.depthExponent,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  waterDepthsM: [0, 10, 20],
  calibratedCoefficient: 2,
  depthExponent: 1.5,
  referenceDepthM: 10,
} satisfies Input;
export const exampleOutput = {
  predictedCalvingSpeedsMPerYear: [0, 2, 5.656854249492381],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/calving-rate-water-depth-power-law",
  title: "Calving Rate Water Depth Power Law",
  description:
    "Evaluate a calibrated water-depth power calving relation normalized by reference depth; coefficients, validity range and glacier type are externally supplied, not universal hazard predictions.",
  inputs: inputFields,
  outputs: [
    {
      id: "predictedCalvingSpeedsMPerYear",
      label: "Predicted calving speeds m per year",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      waterDepthsM: value.waterDepthsM as readonly number[],
      calibratedCoefficient: value.calibratedCoefficient as number,
      depthExponent: value.depthExponent as number,
      referenceDepthM: value.referenceDepthM as number,
    }),
});
export const run = tool.execute;
export default tool;
