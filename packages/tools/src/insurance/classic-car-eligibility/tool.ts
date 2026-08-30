import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly annualMileage: number;
  readonly maximumMileage: number;
  readonly agreedValue: number;
  readonly appraisedValue: number;
  readonly valueTolerancePercent: number;
}>;
export type Output = Readonly<{
  readonly mileageMargin: number;
  readonly valueDifferencePercent: number;
  readonly mileageEligible: boolean;
  readonly valueSupported: boolean;
  readonly eligible: boolean;
}>;

export const calculate = (input: Input): Output => {
  if (input.appraisedValue <= 0)
    simpleError(
      "appraisedValue",
      "Appraised value must be positive.",
      "invalid_appraisal",
    );
  const mileageEligible = input.annualMileage <= input.maximumMileage,
    valueDifferencePercent =
      (Math.abs(input.agreedValue - input.appraisedValue) /
        input.appraisedValue) *
      100,
    valueSupported = valueDifferencePercent <= input.valueTolerancePercent;
  return {
    mileageMargin: input.maximumMileage - input.annualMileage,
    valueDifferencePercent,
    mileageEligible,
    valueSupported,
    eligible: mileageEligible && valueSupported,
  };
};

export const exampleInput = {
  annualMileage: 3000,
  maximumMileage: 5000,
  agreedValue: 51000,
  appraisedValue: 50000,
  valueTolerancePercent: 5,
} satisfies Input;
export const exampleOutput = {
  mileageMargin: 2000,
  valueDifferencePercent: 2,
  mileageEligible: true,
  valueSupported: true,
  eligible: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      annualMileage: input.annualMileage as number,
      maximumMileage: input.maximumMileage as number,
      agreedValue: input.agreedValue as number,
      appraisedValue: input.appraisedValue as number,
      valueTolerancePercent: input.valueTolerancePercent as number,
    }),
  description:
    "Check classic-car mileage and agreed value against supplied eligibility limits.",
  id: "insurance/classic-car-eligibility",
  inputs: [
    {
      id: "annualMileage",
      label: "Annual mileage",
      kind: "integer",
      minimum: 0,
      unit: "mi",
    },
    {
      id: "maximumMileage",
      label: "Maximum eligible mileage",
      kind: "integer",
      minimum: 0,
      unit: "mi",
    },
    {
      id: "agreedValue",
      label: "Requested agreed value",
      kind: "number",
      minimum: 0,
    },
    {
      id: "appraisedValue",
      label: "Appraised value",
      kind: "number",
      minimum: 0,
    },
    {
      id: "valueTolerancePercent",
      label: "Allowed value difference",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "mileageMargin",
      label: "Mileage margin",
      kind: "integer",
      unit: "mi",
    },
    {
      id: "valueDifferencePercent",
      label: "Agreed-to-appraised difference",
      kind: "number",
      minimum: 0,
      unit: "%",
    },
    { id: "mileageEligible", label: "Mileage eligible", kind: "boolean" },
    { id: "valueSupported", label: "Agreed value supported", kind: "boolean" },
    {
      id: "eligible",
      label: "Meets both supplied conditions",
      kind: "boolean",
    },
  ],
  title: "Classic-Car Eligibility",
});

export const run = tool.execute;
export default tool;
