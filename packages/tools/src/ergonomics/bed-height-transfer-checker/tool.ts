import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch39-shared.js";
export type Input = Readonly<{
  readonly observedLoadedBedHeightCm: number;
  readonly observedTransferSeatHeightCm: number;
  readonly callerAllowedTransferDifferenceCm: number;
}>;
export type Output = Readonly<{
  readonly signedBedSeatDifferenceCm: number;
  readonly callerTransferReview: boolean;
}>;
const inputFields = [
  {
    id: "observedLoadedBedHeightCm",
    label: "Observed loaded bed height cm",
    kind: "number",
  },
  {
    id: "observedTransferSeatHeightCm",
    label: "Observed transfer seat height cm",
    kind: "number",
  },
  {
    id: "callerAllowedTransferDifferenceCm",
    label: "Caller allowed transfer difference cm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedLoadedBedHeightCm, "observedLoadedBedHeightCm");
  positive(input.observedTransferSeatHeightCm, "observedTransferSeatHeightCm");
  nonnegative(
    input.callerAllowedTransferDifferenceCm,
    "callerAllowedTransferDifferenceCm",
  );
  const d =
    input.observedLoadedBedHeightCm - input.observedTransferSeatHeightCm;
  return {
    signedBedSeatDifferenceCm: d,
    callerTransferReview: Math.abs(d) > input.callerAllowedTransferDifferenceCm,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedLoadedBedHeightCm: 50,
  observedTransferSeatHeightCm: 45,
  callerAllowedTransferDifferenceCm: 3,
} satisfies Input;
export const exampleOutput = {
  signedBedSeatDifferenceCm: 5,
  callerTransferReview: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/bed-height-transfer-checker",
  title: "Anthropometric Bed Height Transfer Ease Checker",
  description:
    "Actual loaded bed-to-transfer seat signed level difference, not unloaded bed or assumed leg-height comfort. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedBedSeatDifferenceCm",
      label: "Signed bed seat difference cm",
      kind: "number",
    },
    {
      id: "callerTransferReview",
      label: "Caller transfer review",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedLoadedBedHeightCm: value.observedLoadedBedHeightCm as number,
      observedTransferSeatHeightCm:
        value.observedTransferSeatHeightCm as number,
      callerAllowedTransferDifferenceCm:
        value.callerAllowedTransferDifferenceCm as number,
    }),
});
export const run = tool.execute;
export default tool;
