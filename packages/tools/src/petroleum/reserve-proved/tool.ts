import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, classified } from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedAlreadyClassifiedStockVolumesM3: readonly number[];
  readonly callerIndependentReserveClassLabels: readonly string[];
}>;
export type Output = Readonly<{
  readonly matchedTotal: number;
  readonly matchedCount: number;
  readonly unclassifiedCount: number;
}>;
const inputFields = [
  {
    id: "observedAlreadyClassifiedStockVolumesM3",
    label: "Observed already classified stock volumes m3",
    kind: "numberList",
  },
  {
    id: "callerIndependentReserveClassLabels",
    label: "Caller independent reserve class labels",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return classified(
    input.observedAlreadyClassifiedStockVolumesM3,
    input.callerIndependentReserveClassLabels,
    "proved",
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedAlreadyClassifiedStockVolumesM3: [10, 20, 5],
  callerIndependentReserveClassLabels: ["proved", "other", "unknown"],
} satisfies Input;
export const exampleOutput = {
  matchedTotal: 10,
  matchedCount: 1,
  unclassifiedCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "petroleum/reserve-proved",
  title: "Petroleum Reserve Proved Calculator",
  description:
    "Summarize caller already independently assigned incremental proved reserve-category stock volumes, not1P/2P/3P cumulative sums or new reserve classification/valuation. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    { id: "matchedTotal", label: "Matched total", kind: "number" },
    { id: "matchedCount", label: "Matched count", kind: "number" },
    { id: "unclassifiedCount", label: "Unclassified count", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      observedAlreadyClassifiedStockVolumesM3:
        value.observedAlreadyClassifiedStockVolumesM3 as readonly number[],
      callerIndependentReserveClassLabels:
        value.callerIndependentReserveClassLabels as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
