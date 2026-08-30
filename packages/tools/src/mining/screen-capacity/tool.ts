import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly effectiveAreaM2: number;
  readonly baseCapacityTonnesPerHourM2: number;
  readonly correctionFactors: readonly number[];
  readonly requiredThroughputTonnesPerHour: number;
}>;
export type Output = Readonly<{
  readonly predictedCapacityTonnesPerHour: number;
  readonly throughputMarginTonnesPerHour: number;
  readonly meetsRequiredThroughput: boolean;
}>;
const inputFields = [
  { id: "effectiveAreaM2", label: "Effective area m2", kind: "number" },
  {
    id: "baseCapacityTonnesPerHourM2",
    label: "Base capacity tonnes per hour m2",
    kind: "number",
  },
  { id: "correctionFactors", label: "Correction factors", kind: "numberList" },
  {
    id: "requiredThroughputTonnesPerHour",
    label: "Required throughput tonnes per hour",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.effectiveAreaM2, "effectiveAreaM2");
  positive(input.baseCapacityTonnesPerHourM2, "baseCapacityTonnesPerHourM2");
  input.correctionFactors.forEach((v) => positive(v, "correctionFactors"));
  nonnegative(
    input.requiredThroughputTonnesPerHour,
    "requiredThroughputTonnesPerHour",
  );
  if (!input.correctionFactors.length)
    simpleError("correctionFactors", "Nonempty factors required.");
  const predictedCapacityTonnesPerHour =
    input.effectiveAreaM2 *
    input.baseCapacityTonnesPerHourM2 *
    input.correctionFactors.reduce((a, b) => a * b, 1);
  return {
    predictedCapacityTonnesPerHour,
    throughputMarginTonnesPerHour:
      predictedCapacityTonnesPerHour - input.requiredThroughputTonnesPerHour,
    meetsRequiredThroughput:
      predictedCapacityTonnesPerHour >= input.requiredThroughputTonnesPerHour,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  effectiveAreaM2: 10,
  baseCapacityTonnesPerHourM2: 5,
  correctionFactors: [0.8, 0.5],
  requiredThroughputTonnesPerHour: 30,
} satisfies Input;
export const exampleOutput = {
  predictedCapacityTonnesPerHour: 20,
  throughputMarginTonnesPerHour: -10,
  meetsRequiredThroughput: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/screen-capacity",
  title: "Screen Capacity",
  description:
    "Estimate screen capacity from caller area loading and correction factors; no vendor guarantee or calibration applicability is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "predictedCapacityTonnesPerHour",
      label: "Predicted capacity tonnes per hour",
      kind: "number",
    },
    {
      id: "throughputMarginTonnesPerHour",
      label: "Throughput margin tonnes per hour",
      kind: "number",
    },
    {
      id: "meetsRequiredThroughput",
      label: "Meets required throughput",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      effectiveAreaM2: value.effectiveAreaM2 as number,
      baseCapacityTonnesPerHourM2: value.baseCapacityTonnesPerHourM2 as number,
      correctionFactors: value.correctionFactors as readonly number[],
      requiredThroughputTonnesPerHour:
        value.requiredThroughputTonnesPerHour as number,
    }),
});
export const run = tool.execute;
export default tool;
