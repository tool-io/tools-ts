import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly glacierMeltAreaM2: number;
  readonly meltWaterEquivalentMDay: number;
  readonly callerDeliveredRunoffFraction: number;
  readonly observedRiverFlowM3Second: number;
}>;
export type Output = Readonly<{
  readonly modeledGlacierContributionM3Second: number;
  readonly modeledContributionFractionOfObservedRiver: number;
}>;
const inputFields = [
  { id: "glacierMeltAreaM2", label: "Glacier melt area m2", kind: "number" },
  {
    id: "meltWaterEquivalentMDay",
    label: "Melt water equivalent m day",
    kind: "number",
  },
  {
    id: "callerDeliveredRunoffFraction",
    label: "Caller delivered runoff fraction",
    kind: "number",
  },
  {
    id: "observedRiverFlowM3Second",
    label: "Observed river flow m3 second",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedRiverFlowM3Second, "observedRiverFlowM3Second");
  nonnegative(input.glacierMeltAreaM2, "glacierMeltAreaM2");
  nonnegative(input.meltWaterEquivalentMDay, "meltWaterEquivalentMDay");
  fraction(
    input.callerDeliveredRunoffFraction,
    "callerDeliveredRunoffFraction",
  );
  const Q =
    input.glacierMeltAreaM2 *
    (input.meltWaterEquivalentMDay / 86400) *
    input.callerDeliveredRunoffFraction;
  return {
    modeledGlacierContributionM3Second: Q,
    modeledContributionFractionOfObservedRiver:
      Q / input.observedRiverFlowM3Second,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  glacierMeltAreaM2: 86400,
  meltWaterEquivalentMDay: 0.1,
  callerDeliveredRunoffFraction: 0.5,
  observedRiverFlowM3Second: 1,
} satisfies Input;
export const exampleOutput = {
  modeledGlacierContributionM3Second: 0.05,
  modeledContributionFractionOfObservedRiver: 0.05,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/ablation-river-discharge-contribution",
  title: "Ablation River Discharge Contribution Calculator",
  description:
    "Estimate routed daily meltwater contribution against actual river flow using caller delivered fraction; ratios above one remain budget inconsistency evidence, not clamped attribution or drainage-network timing.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledGlacierContributionM3Second",
      label: "Modeled glacier contribution m3 second",
      kind: "number",
    },
    {
      id: "modeledContributionFractionOfObservedRiver",
      label: "Modeled contribution fraction of observed river",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      glacierMeltAreaM2: value.glacierMeltAreaM2 as number,
      meltWaterEquivalentMDay: value.meltWaterEquivalentMDay as number,
      callerDeliveredRunoffFraction:
        value.callerDeliveredRunoffFraction as number,
      observedRiverFlowM3Second: value.observedRiverFlowM3Second as number,
    }),
});
export const run = tool.execute;
export default tool;
