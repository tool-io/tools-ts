import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly channelWidthM: number;
  readonly meanDepthM: number;
  readonly meanVelocityMPerS: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "channelWidthM", label: "Channel width m", kind: "number" },
  { id: "meanDepthM", label: "Mean depth m", kind: "number" },
  { id: "meanVelocityMPerS", label: "Mean velocity m per s", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  positive(i.channelWidthM, "width");
  positive(i.meanDepthM, "depth");
  nonnegative(i.meanVelocityMPerS, "velocity");
  return {
    dischargeM3PerS: i.channelWidthM * i.meanDepthM * i.meanVelocityMPerS,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { channelWidthM: 2, meanDepthM: 3, meanVelocityMPerS: 4 },
  output: { result: { dischargeM3PerS: 24 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/flow-discharge-rate-channel-width",
  title: "Flow Discharge Rate Channel Width Calculator",
  description:
    "Rectangular mean-section discharge of observed volcanic flow; no rheology or hazard forecast.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
