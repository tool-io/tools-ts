import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive, nonnegative, median } from "../shared.js";

export type Input = Readonly<{
  readonly sampleControlCt: number;
  readonly referenceControlCts: readonly number[];
  readonly maximumDelayCycles: number;
}>;
export type Output = Readonly<{
  readonly referenceMedianCt: number;
  readonly delayCycles: number;
  readonly inhibitionFlag: boolean;
}>;
export const calculate = (input: Input): Output => {
  positive(input.sampleControlCt, "sampleControlCt");
  input.referenceControlCts.forEach((v) => positive(v, "referenceControlCts"));
  nonnegative(input.maximumDelayCycles, "maximumDelayCycles");
  const referenceMedianCt = median(input.referenceControlCts),
    delayCycles = input.sampleControlCt - referenceMedianCt;
  return {
    referenceMedianCt,
    delayCycles,
    inhibitionFlag: delayCycles > input.maximumDelayCycles,
  };
};
export const exampleInput = {
  sampleControlCt: 30,
  referenceControlCts: [25, 26, 27],
  maximumDelayCycles: 2,
} satisfies Input;
export const exampleOutput = {
  referenceMedianCt: 26,
  delayCycles: 4,
  inhibitionFlag: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "virology/internal-control-ct-delay",
  title: "Internal Control Ct Delay",
  description:
    "Screen sample internal-control Ct delay against the median reference and a supplied tolerance; delay is not specific for inhibition.",
  inputs: [
    { id: "sampleControlCt", label: "Sample control ct", kind: "number" },
    {
      id: "referenceControlCts",
      label: "Reference control cts",
      kind: "numberList",
    },
    {
      id: "maximumDelayCycles",
      label: "Maximum delay cycles",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "referenceMedianCt", label: "Reference median ct", kind: "number" },
    { id: "delayCycles", label: "Delay cycles", kind: "number" },
    { id: "inhibitionFlag", label: "Inhibition flag", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      sampleControlCt: value.sampleControlCt as number,
      referenceControlCts: value.referenceControlCts as readonly number[],
      maximumDelayCycles: value.maximumDelayCycles as number,
    }),
});
export const run = tool.execute;
export default tool;
