import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly weightKilograms: number;
  readonly heightMeters: number;
  readonly systolicPressure: number;
  readonly bmiThreshold: number;
  readonly pressureThreshold: number;
}>;
export type Output = Readonly<{
  readonly bodyMassIndex: number;
  readonly bmiMargin: number;
  readonly pressureMargin: number;
  readonly riskClass: string;
}>;

export const calculate = (input: Input): Output => {
  if (input.heightMeters <= 0)
    simpleError("heightMeters", "Height must be positive.", "invalid_height");
  const bodyMassIndex = input.weightKilograms / input.heightMeters ** 2,
    bmiHigh = bodyMassIndex > input.bmiThreshold,
    pressureHigh = input.systolicPressure > input.pressureThreshold;
  return {
    bodyMassIndex,
    bmiMargin: input.bmiThreshold - bodyMassIndex,
    pressureMargin: input.pressureThreshold - input.systolicPressure,
    riskClass:
      bmiHigh && pressureHigh
        ? "combined-review"
        : bmiHigh
          ? "build-review"
          : pressureHigh
            ? "pressure-review"
            : "standard",
  };
};

export const exampleInput = {
  weightKilograms: 81,
  heightMeters: 1.8,
  systolicPressure: 130,
  bmiThreshold: 30,
  pressureThreshold: 140,
} satisfies Input;
export const exampleOutput = {
  bodyMassIndex: 25,
  bmiMargin: 5,
  pressureMargin: 10,
  riskClass: "standard",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      weightKilograms: input.weightKilograms as number,
      heightMeters: input.heightMeters as number,
      systolicPressure: input.systolicPressure as number,
      bmiThreshold: input.bmiThreshold as number,
      pressureThreshold: input.pressureThreshold as number,
    }),
  description:
    "Classify build and blood-pressure underwriting indicators against supplied thresholds.",
  id: "insurance/build-pressure-class",
  inputs: [
    {
      id: "weightKilograms",
      label: "Weight",
      kind: "number",
      minimum: 0,
      unit: "kg",
    },
    {
      id: "heightMeters",
      label: "Height",
      kind: "number",
      minimum: 0,
      unit: "m",
    },
    {
      id: "systolicPressure",
      label: "Systolic blood pressure",
      kind: "number",
      minimum: 0,
      unit: "mmHg",
    },
    { id: "bmiThreshold", label: "BMI threshold", kind: "number", minimum: 0 },
    {
      id: "pressureThreshold",
      label: "Systolic threshold",
      kind: "number",
      minimum: 0,
      unit: "mmHg",
    },
  ],
  outputs: [
    {
      id: "bodyMassIndex",
      label: "Body mass index",
      kind: "number",
      minimum: 0,
    },
    { id: "bmiMargin", label: "BMI threshold margin", kind: "number" },
    {
      id: "pressureMargin",
      label: "Pressure threshold margin",
      kind: "number",
      unit: "mmHg",
    },
    {
      id: "riskClass",
      label: "Build-pressure class",
      kind: "string",
      enum: ["standard", "build-review", "pressure-review", "combined-review"],
    },
  ],
  title: "Build–Pressure Class",
});

export const run = tool.execute;
export default tool;
