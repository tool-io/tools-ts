import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedOverallComminutionFeedD80Mm: readonly number[];
  readonly observedOverallComminutionProductD80Mm: readonly number[];
  readonly callerMatchedOverallComminutionNominalRatios: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedSizeReductionRatios: readonly number[];
  readonly signedRatioMinusNominal: readonly number[];
}>;
const inputFields = [
  {
    id: "observedOverallComminutionFeedD80Mm",
    label: "Observed overall comminution feed d80 mm",
    kind: "numberList",
  },
  {
    id: "observedOverallComminutionProductD80Mm",
    label: "Observed overall comminution product d80 mm",
    kind: "numberList",
  },
  {
    id: "callerMatchedOverallComminutionNominalRatios",
    label: "Caller matched overall comminution nominal ratios",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedOverallComminutionFeedD80Mm.forEach((v) =>
    positive(v, "observedOverallComminutionFeedD80Mm"),
  );
  input.observedOverallComminutionProductD80Mm.forEach((v) =>
    positive(v, "observedOverallComminutionProductD80Mm"),
  );
  input.callerMatchedOverallComminutionNominalRatios.forEach((v) =>
    positive(v, "callerMatchedOverallComminutionNominalRatios"),
  );
  aligned(
    input.observedOverallComminutionFeedD80Mm,
    input.observedOverallComminutionProductD80Mm,
    "observedOverallComminutionFeedD80Mm",
  );
  aligned(
    input.observedOverallComminutionFeedD80Mm,
    input.callerMatchedOverallComminutionNominalRatios,
    "observedOverallComminutionFeedD80Mm",
  );
  const ratios = input.observedOverallComminutionFeedD80Mm.map(
    (v, i) => v / input.observedOverallComminutionProductD80Mm[i],
  );
  return {
    observedSizeReductionRatios: ratios,
    signedRatioMinusNominal: ratios.map(
      (v, i) => v - input.callerMatchedOverallComminutionNominalRatios[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedOverallComminutionFeedD80Mm: [100, 200],
  observedOverallComminutionProductD80Mm: [20, 100],
  callerMatchedOverallComminutionNominalRatios: [4, 3],
} satisfies Input;
export const exampleOutput = {
  observedSizeReductionRatios: [5, 2],
  signedRatioMinusNominal: [1, -1],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/reduction-ratio",
  title: "Reduction Ratio Calculator",
  description:
    "Audit actual OverallComminution matched D80 reduction against independent nominal trial ratios, not Bond net energy or two streams assumed additive. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedSizeReductionRatios",
      label: "Observed size reduction ratios",
      kind: "numberList",
    },
    {
      id: "signedRatioMinusNominal",
      label: "Signed ratio minus nominal",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedOverallComminutionFeedD80Mm:
        value.observedOverallComminutionFeedD80Mm as readonly number[],
      observedOverallComminutionProductD80Mm:
        value.observedOverallComminutionProductD80Mm as readonly number[],
      callerMatchedOverallComminutionNominalRatios:
        value.callerMatchedOverallComminutionNominalRatios as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
