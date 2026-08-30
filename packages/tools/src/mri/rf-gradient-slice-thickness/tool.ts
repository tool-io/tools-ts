import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly rfBandwidthHz: number;
  readonly gammaHzPerTesla: number;
  readonly sliceGradientMilliTeslaPerMeter: number;
}>;
export type Output = Readonly<{
  readonly thicknessMm: number;
}>;
const inputFields = [
  { id: "rfBandwidthHz", label: "Rf bandwidth hz", kind: "number", unit: "Hz" },
  { id: "gammaHzPerTesla", label: "Gamma hz per tesla", kind: "number" },
  {
    id: "sliceGradientMilliTeslaPerMeter",
    label: "Slice gradient milli tesla per meter",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.rfBandwidthHz, "rfBandwidthHz");
  positive(input.gammaHzPerTesla, "gammaHzPerTesla");
  positive(
    input.sliceGradientMilliTeslaPerMeter,
    "sliceGradientMilliTeslaPerMeter",
  );
  return {
    thicknessMm:
      (1e6 * input.rfBandwidthHz) /
      (input.gammaHzPerTesla * input.sliceGradientMilliTeslaPerMeter),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  rfBandwidthHz: 2000,
  gammaHzPerTesla: 1000000,
  sliceGradientMilliTeslaPerMeter: 10,
} satisfies Input;
export const exampleOutput = { thicknessMm: 200 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/rf-gradient-slice-thickness",
  title: "Slice Thickness",
  description:
    "Compute nominal slice thickness from RF bandwidth and slice-select gradient in explicit Hz/T and mT/m units; RF profile and off-resonance effects are not modeled.",
  inputs: inputFields,
  outputs: [
    { id: "thicknessMm", label: "Thickness mm", kind: "number", unit: "mm" },
  ],
  calculate: (value) =>
    calculate({
      rfBandwidthHz: value.rfBandwidthHz as number,
      gammaHzPerTesla: value.gammaHzPerTesla as number,
      sliceGradientMilliTeslaPerMeter:
        value.sliceGradientMilliTeslaPerMeter as number,
    }),
});
export const run = tool.execute;
export default tool;
