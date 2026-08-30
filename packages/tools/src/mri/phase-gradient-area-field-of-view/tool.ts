import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";
export type Input = Readonly<{
  readonly gammaHzPerTesla: number;
  readonly phaseAreaIncrementMilliTeslaMsPerMeter: number;
}>;
export type Output = Readonly<{
  readonly phaseDeltaKCyclesPerMeter: number;
  readonly phaseFovMm: number;
}>;
const inputFields = [
  { id: "gammaHzPerTesla", label: "Gamma hz per tesla", kind: "number" },
  {
    id: "phaseAreaIncrementMilliTeslaMsPerMeter",
    label: "Phase area increment milli tesla ms per meter",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.gammaHzPerTesla, "gammaHzPerTesla");
  positive(
    input.phaseAreaIncrementMilliTeslaMsPerMeter,
    "phaseAreaIncrementMilliTeslaMsPerMeter",
  );
  const phaseDeltaKCyclesPerMeter =
    input.gammaHzPerTesla * input.phaseAreaIncrementMilliTeslaMsPerMeter * 1e-6;
  return {
    phaseDeltaKCyclesPerMeter,
    phaseFovMm: 1000 / phaseDeltaKCyclesPerMeter,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  gammaHzPerTesla: 1000000,
  phaseAreaIncrementMilliTeslaMsPerMeter: 4,
} satisfies Input;
export const exampleOutput = {
  phaseDeltaKCyclesPerMeter: 4,
  phaseFovMm: 250,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mri/phase-gradient-area-field-of-view",
  title: "Phase Field of View",
  description:
    "Derive phase-encoding FOV from adjacent gradient-area increments; γ uses cycles/s/T rather than angular units.",
  inputs: inputFields,
  outputs: [
    {
      id: "phaseDeltaKCyclesPerMeter",
      label: "Phase delta k cycles per meter",
      kind: "number",
    },
    { id: "phaseFovMm", label: "Phase fov mm", kind: "number", unit: "mm" },
  ],
  calculate: (value) =>
    calculate({
      gammaHzPerTesla: value.gammaHzPerTesla as number,
      phaseAreaIncrementMilliTeslaMsPerMeter:
        value.phaseAreaIncrementMilliTeslaMsPerMeter as number,
    }),
});
export const run = tool.execute;
export default tool;
