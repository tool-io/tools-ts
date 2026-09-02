import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedExcessNoiseSignificance: number;
  readonly callerSignificanceReviewFloor: number;
}>;
export type Output = Readonly<{
  readonly callerExcessNoiseReviewFlag: boolean;
  readonly signedSignificanceAboveFloor: number;
}>;
const inputFields = [
  {
    id: "observedExcessNoiseSignificance",
    label: "Observed excess noise significance",
    kind: "number",
  },
  {
    id: "callerSignificanceReviewFloor",
    label: "Caller significance review floor",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerSignificanceReviewFloor,
    "callerSignificanceReviewFloor",
  );
  nonnegative(
    input.observedExcessNoiseSignificance,
    "observedExcessNoiseSignificance",
  );
  return {
    callerExcessNoiseReviewFlag:
      input.observedExcessNoiseSignificance >=
      input.callerSignificanceReviewFloor,
    signedSignificanceAboveFloor:
      input.observedExcessNoiseSignificance -
      input.callerSignificanceReviewFloor,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedExcessNoiseSignificance: 2,
  callerSignificanceReviewFloor: 2,
} satisfies Input;
export const exampleOutput = {
  callerExcessNoiseReviewFlag: true,
  signedSignificanceAboveFloor: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrometry/excess-noise-significance-classifier",
  title: "Excess Noise Astrometric Parameter Significance Classifier",
  description:
    "Screen independent catalog excess-noise significance D(not noise/σsubstitution) against caller release-specific floor. Caller independently establishes frames, units, epoch, covariance and instrument context; not an identity, association or astrometric quality certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerExcessNoiseReviewFlag",
      label: "Caller excess noise review flag",
      kind: "boolean",
    },
    {
      id: "signedSignificanceAboveFloor",
      label: "Signed significance above floor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedExcessNoiseSignificance:
        value.observedExcessNoiseSignificance as number,
      callerSignificanceReviewFloor:
        value.callerSignificanceReviewFloor as number,
    }),
});
export const run = tool.execute;
export default tool;
