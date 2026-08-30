import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, count } from "../shared.js";
export type Input = Readonly<{
  readonly originationEventCount: number;
  readonly extinctionEventCount: number;
  readonly lineageTimeExposureMyr: number;
}>;
export type Output = Readonly<{
  readonly originationRatePerLineageMyr: number;
  readonly extinctionRatePerLineageMyr: number;
  readonly signedNetDiversificationRatePerLineageMyr: number;
  readonly independentNetRateStandardError: number;
}>;
const inputFields = [
  {
    id: "originationEventCount",
    label: "Origination event count",
    kind: "integer",
  },
  {
    id: "extinctionEventCount",
    label: "Extinction event count",
    kind: "integer",
  },
  {
    id: "lineageTimeExposureMyr",
    label: "Lineage time exposure myr",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.lineageTimeExposureMyr, "lineageTimeExposureMyr");
  count(input.originationEventCount, "originationEventCount");
  count(input.extinctionEventCount, "extinctionEventCount");
  return {
    originationRatePerLineageMyr:
      input.originationEventCount / input.lineageTimeExposureMyr,
    extinctionRatePerLineageMyr:
      input.extinctionEventCount / input.lineageTimeExposureMyr,
    signedNetDiversificationRatePerLineageMyr:
      (input.originationEventCount - input.extinctionEventCount) /
      input.lineageTimeExposureMyr,
    independentNetRateStandardError:
      Math.sqrt(input.originationEventCount + input.extinctionEventCount) /
      input.lineageTimeExposureMyr,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  originationEventCount: 10,
  extinctionEventCount: 6,
  lineageTimeExposureMyr: 20,
} satisfies Input;
export const exampleOutput = {
  originationRatePerLineageMyr: 0.5,
  extinctionRatePerLineageMyr: 0.3,
  signedNetDiversificationRatePerLineageMyr: 0.2,
  independentNetRateStandardError: 0.2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/net-diversification-rate",
  title: "Net Diversification Rate",
  description:
    "Calculate signed event/exposure net diversification with independent origination/extinction counting error; unlike log endpoint richness growth, this requires explicit event and lineage-time inventories.",
  inputs: inputFields,
  outputs: [
    {
      id: "originationRatePerLineageMyr",
      label: "Origination rate per lineage myr",
      kind: "number",
    },
    {
      id: "extinctionRatePerLineageMyr",
      label: "Extinction rate per lineage myr",
      kind: "number",
    },
    {
      id: "signedNetDiversificationRatePerLineageMyr",
      label: "Signed net diversification rate per lineage myr",
      kind: "number",
    },
    {
      id: "independentNetRateStandardError",
      label: "Independent net rate standard error",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      originationEventCount: value.originationEventCount as number,
      extinctionEventCount: value.extinctionEventCount as number,
      lineageTimeExposureMyr: value.lineageTimeExposureMyr as number,
    }),
});
export const run = tool.execute;
export default tool;
