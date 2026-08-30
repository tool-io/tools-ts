import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly observedFadeCoordinateChange: number;
  readonly testLuxHours: number;
  readonly referenceAnnualLuxHours: number;
  readonly callerReferenceFadePerLuxHour: number;
}>;
export type Output = Readonly<{
  readonly observedFadePerLuxHour: number;
  readonly equivalentReferenceFadingYears: number;
}>;
const inputFields = [
  {
    id: "observedFadeCoordinateChange",
    label: "Observed fade coordinate change",
    kind: "number",
  },
  { id: "testLuxHours", label: "Test lux hours", kind: "number" },
  {
    id: "referenceAnnualLuxHours",
    label: "Reference annual lux hours",
    kind: "number",
  },
  {
    id: "callerReferenceFadePerLuxHour",
    label: "Caller reference fade per lux hour",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.testLuxHours, "testLuxHours");
  positive(input.referenceAnnualLuxHours, "referenceAnnualLuxHours");
  positive(
    input.callerReferenceFadePerLuxHour,
    "callerReferenceFadePerLuxHour",
  );
  nonnegative(
    input.observedFadeCoordinateChange,
    "observedFadeCoordinateChange",
  );
  return {
    observedFadePerLuxHour:
      input.observedFadeCoordinateChange / input.testLuxHours,
    equivalentReferenceFadingYears:
      input.observedFadeCoordinateChange /
      (input.callerReferenceFadePerLuxHour * input.referenceAnnualLuxHours),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedFadeCoordinateChange: 2,
  testLuxHours: 100,
  referenceAnnualLuxHours: 1000,
  callerReferenceFadePerLuxHour: 0.01,
} satisfies Input;
export const exampleOutput = {
  observedFadePerLuxHour: 0.02,
  equivalentReferenceFadingYears: 0.2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/fugitometer-fading-years-estimator",
  title: "Fugitometer Equivalent Fading Years Estimator",
  description:
    "Express measured fugitometer fading as a caller calibrated reference-equivalent exposure duration; same fade coordinate and linear local response assumed, no lifespan/reversibility guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedFadePerLuxHour",
      label: "Observed fade per lux hour",
      kind: "number",
    },
    {
      id: "equivalentReferenceFadingYears",
      label: "Equivalent reference fading years",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedFadeCoordinateChange:
        value.observedFadeCoordinateChange as number,
      testLuxHours: value.testLuxHours as number,
      referenceAnnualLuxHours: value.referenceAnnualLuxHours as number,
      callerReferenceFadePerLuxHour:
        value.callerReferenceFadePerLuxHour as number,
    }),
});
export const run = tool.execute;
export default tool;
