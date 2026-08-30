import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  count,
} from "../shared.js";
export type Input = Readonly<{
  readonly batchFishCounts: readonly number[];
  readonly graderNominalFishPerHour: number;
  readonly productiveFraction: number;
  readonly requiredPasses: number;
  readonly setupHoursPerBatch: number;
}>;
export type Output = Readonly<{
  readonly batchHours: readonly number[];
  readonly totalGradingHours: number;
  readonly overallEffectiveFishPerHour: number;
}>;
const inputFields = [
  { id: "batchFishCounts", label: "Batch fish counts", kind: "numberList" },
  {
    id: "graderNominalFishPerHour",
    label: "Grader nominal fish per hour",
    kind: "number",
  },
  { id: "productiveFraction", label: "Productive fraction", kind: "number" },
  { id: "requiredPasses", label: "Required passes", kind: "integer" },
  { id: "setupHoursPerBatch", label: "Setup hours per batch", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.graderNominalFishPerHour, "graderNominalFishPerHour");
  positive(input.productiveFraction, "productiveFraction");
  positive(input.requiredPasses, "requiredPasses");
  nonnegative(input.setupHoursPerBatch, "setupHoursPerBatch");
  fraction(input.productiveFraction, "productiveFraction");
  input.batchFishCounts.forEach((v) => count(v, "batchFishCounts"));
  count(input.requiredPasses, "requiredPasses");
  if (!input.batchFishCounts.length)
    simpleError("batchFishCounts", "Nonempty batches required.");
  const batchHours = input.batchFishCounts.map(
      (v) =>
        (v * input.requiredPasses) /
          (input.graderNominalFishPerHour * input.productiveFraction) +
        input.setupHoursPerBatch,
    ),
    totalGradingHours = positive(
      batchHours.reduce((a, b) => a + b, 0),
      "totalGradingHours",
    );
  return {
    batchHours,
    totalGradingHours,
    overallEffectiveFishPerHour:
      input.batchFishCounts.reduce((a, b) => a + b, 0) / totalGradingHours,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  batchFishCounts: [1000, 2000],
  graderNominalFishPerHour: 2000,
  productiveFraction: 0.5,
  requiredPasses: 2,
  setupHoursPerBatch: 0.25,
} satisfies Input;
export const exampleOutput = {
  batchHours: [2.25, 4.25],
  totalGradingHours: 6.5,
  overallEffectiveFishPerHour: 461.53846153846155,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/grading-throughput",
  title: "Grading Throughput",
  description:
    "Plan batch grading duration with repeat passes, productive fraction and per-batch setup; reports unique fish throughput rather than counting repeated passes as new fish.",
  inputs: inputFields,
  outputs: [
    { id: "batchHours", label: "Batch hours", kind: "numberList" },
    { id: "totalGradingHours", label: "Total grading hours", kind: "number" },
    {
      id: "overallEffectiveFishPerHour",
      label: "Overall effective fish per hour",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      batchFishCounts: value.batchFishCounts as readonly number[],
      graderNominalFishPerHour: value.graderNominalFishPerHour as number,
      productiveFraction: value.productiveFraction as number,
      requiredPasses: value.requiredPasses as number,
      setupHoursPerBatch: value.setupHoursPerBatch as number,
    }),
});
export const run = tool.execute;
export default tool;
