import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, aligned } from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedJawCrusherFeedD80Mm: readonly number[];
  readonly observedJawCrusherProductD80Mm: readonly number[];
  readonly callerMatchedJawCrusherNominalRatios: readonly number[];
}>;
export type Output = Readonly<{
  readonly observedSizeReductionRatios: readonly number[];
  readonly signedRatioMinusNominal: readonly number[];
}>;
const inputFields = [
  {
    id: "observedJawCrusherFeedD80Mm",
    label: "Observed jaw crusher feed d80 mm",
    kind: "numberList",
  },
  {
    id: "observedJawCrusherProductD80Mm",
    label: "Observed jaw crusher product d80 mm",
    kind: "numberList",
  },
  {
    id: "callerMatchedJawCrusherNominalRatios",
    label: "Caller matched jaw crusher nominal ratios",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedJawCrusherFeedD80Mm.forEach((v) =>
    positive(v, "observedJawCrusherFeedD80Mm"),
  );
  input.observedJawCrusherProductD80Mm.forEach((v) =>
    positive(v, "observedJawCrusherProductD80Mm"),
  );
  input.callerMatchedJawCrusherNominalRatios.forEach((v) =>
    positive(v, "callerMatchedJawCrusherNominalRatios"),
  );
  aligned(
    input.observedJawCrusherFeedD80Mm,
    input.observedJawCrusherProductD80Mm,
    "observedJawCrusherFeedD80Mm",
  );
  aligned(
    input.observedJawCrusherFeedD80Mm,
    input.callerMatchedJawCrusherNominalRatios,
    "observedJawCrusherFeedD80Mm",
  );
  const ratios = input.observedJawCrusherFeedD80Mm.map(
    (v, i) => v / input.observedJawCrusherProductD80Mm[i],
  );
  return {
    observedSizeReductionRatios: ratios,
    signedRatioMinusNominal: ratios.map(
      (v, i) => v - input.callerMatchedJawCrusherNominalRatios[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedJawCrusherFeedD80Mm: [100, 200],
  observedJawCrusherProductD80Mm: [20, 100],
  callerMatchedJawCrusherNominalRatios: [4, 3],
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
  id: "mining/crushing-ratio",
  title: "Crushing Ratio Calculator",
  description:
    "Audit actual JawCrusher matched D80 reduction against independent nominal trial ratios, not Bond net energy or two streams assumed additive. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
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
      observedJawCrusherFeedD80Mm:
        value.observedJawCrusherFeedD80Mm as readonly number[],
      observedJawCrusherProductD80Mm:
        value.observedJawCrusherProductD80Mm as readonly number[],
      callerMatchedJawCrusherNominalRatios:
        value.callerMatchedJawCrusherNominalRatios as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
