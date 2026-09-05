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
  aligned,
  strictlyIncreasing,
  finite,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedFlotationCollectionTimesSeconds: readonly number[];
  readonly observedIncrementalRecoveredMetalKg: readonly number[];
  readonly observedOriginalFeedMetalKg: number;
}>;
export type Output = Readonly<{
  readonly observedCumulativeFlotationRecoveryFractions: readonly number[];
}>;
const inputFields = [
  {
    id: "observedFlotationCollectionTimesSeconds",
    label: "Observed flotation collection times seconds",
    kind: "numberList",
  },
  {
    id: "observedIncrementalRecoveredMetalKg",
    label: "Observed incremental recovered metal kg",
    kind: "numberList",
  },
  {
    id: "observedOriginalFeedMetalKg",
    label: "Observed original feed metal kg",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedOriginalFeedMetalKg, "observedOriginalFeedMetalKg");
  input.observedFlotationCollectionTimesSeconds.forEach((v) =>
    nonnegative(v, "observedFlotationCollectionTimesSeconds"),
  );
  input.observedIncrementalRecoveredMetalKg.forEach((v) =>
    nonnegative(v, "observedIncrementalRecoveredMetalKg"),
  );
  aligned(
    input.observedFlotationCollectionTimesSeconds,
    input.observedIncrementalRecoveredMetalKg,
    "observedFlotationCollectionTimesSeconds",
  );
  strictlyIncreasing(
    input.observedFlotationCollectionTimesSeconds,
    "collection times",
    1,
  );
  let cumulative = 0;
  return {
    observedCumulativeFlotationRecoveryFractions:
      input.observedIncrementalRecoveredMetalKg.map((v) => {
        cumulative = finite(cumulative + v);
        if (cumulative > input.observedOriginalFeedMetalKg)
          simpleError("recovery", "Measured cumulative≤original feed metal.");
        return cumulative / input.observedOriginalFeedMetalKg;
      }),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedFlotationCollectionTimesSeconds: [1, 2, 3],
  observedIncrementalRecoveredMetalKg: [1, 2, 1],
  observedOriginalFeedMetalKg: 10,
} satisfies Input;
export const exampleOutput = {
  observedCumulativeFlotationRecoveryFractions: [0.1, 0.3, 0.4],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/flotation-recovery-vs-time",
  title: "Flotation Recovery vs Time Calculator",
  description:
    "Route actual timed incremental flotation metal collection ledger, no fitted exponential recovery or invented ultimate asymptote. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedCumulativeFlotationRecoveryFractions",
      label: "Observed cumulative flotation recovery fractions",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedFlotationCollectionTimesSeconds:
        value.observedFlotationCollectionTimesSeconds as readonly number[],
      observedIncrementalRecoveredMetalKg:
        value.observedIncrementalRecoveredMetalKg as readonly number[],
      observedOriginalFeedMetalKg: value.observedOriginalFeedMetalKg as number,
    }),
});
export const run = tool.execute;
export default tool;
