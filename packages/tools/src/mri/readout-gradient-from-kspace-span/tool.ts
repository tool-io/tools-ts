import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly kSpaceSpanCyclesPerMeter: number;
  readonly readoutDurationMs: number;
  readonly gammaHzPerTesla: number;
}>;
export type Output = Readonly<{
  readonly requiredGradientMilliTeslaPerMeter: number;
}>;
const inputFields = [
  {
    id: "kSpaceSpanCyclesPerMeter",
    label: "K space span cycles per meter",
    kind: "number",
  },
  {
    id: "readoutDurationMs",
    label: "Readout duration ms",
    kind: "number",
    unit: "ms",
  },
  { id: "gammaHzPerTesla", label: "Gamma hz per tesla", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.kSpaceSpanCyclesPerMeter, "kSpaceSpanCyclesPerMeter");
  positive(input.readoutDurationMs, "readoutDurationMs");
  positive(input.gammaHzPerTesla, "gammaHzPerTesla");
  return {
    requiredGradientMilliTeslaPerMeter:
      (1e6 * input.kSpaceSpanCyclesPerMeter) /
      (input.gammaHzPerTesla * input.readoutDurationMs),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  kSpaceSpanCyclesPerMeter: 1000,
  readoutDurationMs: 10,
  gammaHzPerTesla: 1000000,
} satisfies Input;
export const exampleOutput = {
  requiredGradientMilliTeslaPerMeter: 100,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/readout-gradient-from-kspace-span",
  title: "Gradient Amplitude Required",
  description:
    "Derive constant readout gradient from desired k-space traversal span and duration; prephasers, ramps and gradient hardware feasibility are excluded.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredGradientMilliTeslaPerMeter",
      label: "Required gradient milli tesla per meter",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      kSpaceSpanCyclesPerMeter: value.kSpaceSpanCyclesPerMeter as number,
      readoutDurationMs: value.readoutDurationMs as number,
      gammaHzPerTesla: value.gammaHzPerTesla as number,
    }),
});
export const run = tool.execute;
export default tool;
