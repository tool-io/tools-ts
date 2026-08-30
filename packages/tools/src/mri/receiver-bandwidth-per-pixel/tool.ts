import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, count } from "../shared.js";
export type Input = Readonly<{
  readonly totalReceiverBandwidthHz: number;
  readonly readoutSamples: number;
}>;
export type Output = Readonly<{
  readonly hzPerPixel: number;
}>;
const inputFields = [
  {
    id: "totalReceiverBandwidthHz",
    label: "Total receiver bandwidth hz",
    kind: "number",
    unit: "Hz",
  },
  { id: "readoutSamples", label: "Readout samples", kind: "integer" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.totalReceiverBandwidthHz, "totalReceiverBandwidthHz");
  count(input.readoutSamples, "readoutSamples", 1);
  return { hzPerPixel: input.totalReceiverBandwidthHz / input.readoutSamples };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  totalReceiverBandwidthHz: 51200,
  readoutSamples: 256,
} satisfies Input;
export const exampleOutput = { hzPerPixel: 200 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/receiver-bandwidth-per-pixel",
  title: "Bandwidth Per Pixel",
  description:
    "Convert full-span ADC receiver bandwidth to frequency-encoding bandwidth per reconstructed readout sample; vendor half-bandwidth conventions must be converted first.",
  inputs: inputFields,
  outputs: [{ id: "hzPerPixel", label: "Hz per pixel", kind: "number" }],
  calculate: (value) =>
    calculate({
      totalReceiverBandwidthHz: value.totalReceiverBandwidthHz as number,
      readoutSamples: value.readoutSamples as number,
    }),
});
export const run = tool.execute;
export default tool;
