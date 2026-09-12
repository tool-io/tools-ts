import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, bounded } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualBandwidthHzPerAcquiredReadoutPixel: number;
  readonly actualAcquiredReadoutPixelCount: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualBandwidthHzPerAcquiredReadoutPixel",
    label: "Actual bandwidth hz per acquired readout pixel",
    kind: "number",
  },
  {
    id: "actualAcquiredReadoutPixelCount",
    label: "Actual acquired readout pixel count",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(
    input.actualBandwidthHzPerAcquiredReadoutPixel,
    "actualBandwidthHzPerAcquiredReadoutPixel",
  );
  bounded(
    input.actualAcquiredReadoutPixelCount,
    "actualAcquiredReadoutPixelCount",
    1,
    1000000,
  );
  return {
    value:
      input.actualBandwidthHzPerAcquiredReadoutPixel *
      input.actualAcquiredReadoutPixelCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualBandwidthHzPerAcquiredReadoutPixel: 2,
    actualAcquiredReadoutPixelCount: 100,
  },
  output: { result: { value: 200 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/bandwidth-total",
  title: "Total Bandwidth Calculator",
  description:
    "Declared totalreadoutreceiverHz fromHz/acquired pixel\u00d7count, not kHzone-sided or scan sequence bandwidth without convention.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
