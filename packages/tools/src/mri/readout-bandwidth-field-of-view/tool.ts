import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly receiverBandwidthHz: number;
  readonly gammaHzPerTesla: number;
  readonly readoutGradientMilliTeslaPerMeter: number;
}>;
export type Output = Readonly<{
  readonly readoutFovMm: number;
}>;
const inputFields = [
  {
    id: "receiverBandwidthHz",
    label: "Receiver bandwidth hz",
    kind: "number",
    unit: "Hz",
  },
  { id: "gammaHzPerTesla", label: "Gamma hz per tesla", kind: "number" },
  {
    id: "readoutGradientMilliTeslaPerMeter",
    label: "Readout gradient milli tesla per meter",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.receiverBandwidthHz, "receiverBandwidthHz");
  positive(input.gammaHzPerTesla, "gammaHzPerTesla");
  positive(
    input.readoutGradientMilliTeslaPerMeter,
    "readoutGradientMilliTeslaPerMeter",
  );
  return {
    readoutFovMm:
      (1e6 * input.receiverBandwidthHz) /
      (input.gammaHzPerTesla * input.readoutGradientMilliTeslaPerMeter),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  receiverBandwidthHz: 2560,
  gammaHzPerTesla: 1000000,
  readoutGradientMilliTeslaPerMeter: 10,
} satisfies Input;
export const exampleOutput = { readoutFovMm: 256 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/readout-bandwidth-field-of-view",
  title: "Readout Field of View",
  description:
    "Derive frequency-encoding FOV from full signed-span receiver bandwidth and constant readout gradient, not a pixels-times-spacing lookup.",
  inputs: inputFields,
  outputs: [
    { id: "readoutFovMm", label: "Readout fov mm", kind: "number", unit: "mm" },
  ],
  calculate: (value) =>
    calculate({
      receiverBandwidthHz: value.receiverBandwidthHz as number,
      gammaHzPerTesla: value.gammaHzPerTesla as number,
      readoutGradientMilliTeslaPerMeter:
        value.readoutGradientMilliTeslaPerMeter as number,
    }),
});
export const run = tool.execute;
export default tool;
