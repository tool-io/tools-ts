import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, bounded } from "../batch36-shared.js";
export type Input = Readonly<{
  readonly callerBraggVacuumWavelengthM: number;
  readonly callerMatchedEffectiveIndex: number;
  readonly callerGratingOrder: number;
}>;
export type Output = Readonly<{ readonly modeledDfbFirstBraggPeriodM: number }>;
const inputFields = [
  {
    id: "callerBraggVacuumWavelengthM",
    label: "Caller bragg vacuum wavelength m",
    kind: "number",
  },
  {
    id: "callerMatchedEffectiveIndex",
    label: "Caller matched effective index",
    kind: "number",
  },
  { id: "callerGratingOrder", label: "Caller grating order", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.callerBraggVacuumWavelengthM, "callerBraggVacuumWavelengthM");
  positive(input.callerMatchedEffectiveIndex, "callerMatchedEffectiveIndex");
  bounded(input.callerGratingOrder, "order", 1, 100);
  return {
    modeledDfbFirstBraggPeriodM:
      (input.callerGratingOrder * input.callerBraggVacuumWavelengthM) /
      (2 * input.callerMatchedEffectiveIndex),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerBraggVacuumWavelengthM: 1,
  callerMatchedEffectiveIndex: 2,
  callerGratingOrder: 1,
} satisfies Input;
export const exampleOutput = {
  modeledDfbFirstBraggPeriodM: 0.25,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/distributed-feedback-laser-grating-period",
  title: "Semiconductor Distributed Feedback Laser Grating Period Calculator",
  description:
    "Calculate explicit mλ/(2neff) DFB Bragg period with caller order/index, not assumed effective wavelength or fabrication specification.",
  inputs: inputFields,
  outputs: [
    {
      id: "modeledDfbFirstBraggPeriodM",
      label: "Modeled dfb first bragg period m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerBraggVacuumWavelengthM:
        value.callerBraggVacuumWavelengthM as number,
      callerMatchedEffectiveIndex: value.callerMatchedEffectiveIndex as number,
      callerGratingOrder: value.callerGratingOrder as number,
    }),
});
export const run = tool.execute;
export default tool;
