import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch41-shared.js";
export type Input = Readonly<{
  readonly observedMassG: number;
  readonly independentlyMeasuredVolumeCM3: number;
}>;
export type Output = Readonly<{ readonly observedDensityGCM3: number }>;
const inputFields = [
  { id: "observedMassG", label: "Observed mass g", kind: "number" },
  {
    id: "independentlyMeasuredVolumeCM3",
    label: "Independently measured volume c m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.independentlyMeasuredVolumeCM3,
    "independentlyMeasuredVolumeCM3",
  );
  nonnegative(input.observedMassG, "observedMassG");
  return {
    observedDensityGCM3:
      input.observedMassG / input.independentlyMeasuredVolumeCM3,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedMassG: 2,
  independentlyMeasuredVolumeCM3: 0.5,
} satisfies Input;
export const exampleOutput = { observedDensityGCM3: 4 } satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "gemology/density-mass-volume",
  title: "Density from Mass and Volume Calculator",
  description:
    "Direct independently measured mass/volume density, not buoyancy-derived SG or mineral identity. Caller independently establishes geometry, assay, calibration and protocol; not material identity, laboratory grade, treatment or care safety.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedDensityGCM3",
      label: "Observed density g c m3",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedMassG: value.observedMassG as number,
      independentlyMeasuredVolumeCM3:
        value.independentlyMeasuredVolumeCM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
