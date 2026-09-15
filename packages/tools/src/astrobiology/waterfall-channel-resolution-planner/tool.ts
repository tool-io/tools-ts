import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, bounded } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly totalBandwidthHz: number;
  readonly channelCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "totalBandwidthHz", label: "Total bandwidth hz", kind: "number" },
  { id: "channelCount", label: "Channel count", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  positive(i.totalBandwidthHz, "bandwidth");
  bounded(i.channelCount, "channels", 1, 1000000000);
  return { channelWidthHz: i.totalBandwidthHz / i.channelCount };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { totalBandwidthHz: 1000, channelCount: 100 },
  output: { result: { channelWidthHz: 10 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astrobiology/waterfall-channel-resolution-planner",
  title: "Waterfall Search Frequency Resolution Hz per Channel Planner",
  description:
    "Uniform waterfall channel width from bandwidth and channel count; not actual FFT resolution, Doppler drift search or sensitivity guarantee.",
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
