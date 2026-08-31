import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch32-shared.js";
export type Input = Readonly<{
  readonly upperLayerDensityKgM3: number;
  readonly lowerLayerDensityKgM3: number;
  readonly callerReferenceDensityContrastKgM3: number;
}>;
export type Output = Readonly<{
  readonly signedRelativeThermalResistance: number;
  readonly stableDensityOrdering: boolean;
}>;
const inputFields = [
  {
    id: "upperLayerDensityKgM3",
    label: "Upper layer density kg m3",
    kind: "number",
  },
  {
    id: "lowerLayerDensityKgM3",
    label: "Lower layer density kg m3",
    kind: "number",
  },
  {
    id: "callerReferenceDensityContrastKgM3",
    label: "Caller reference density contrast kg m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.upperLayerDensityKgM3, "upperLayerDensityKgM3");
  positive(input.lowerLayerDensityKgM3, "lowerLayerDensityKgM3");
  positive(
    input.callerReferenceDensityContrastKgM3,
    "callerReferenceDensityContrastKgM3",
  );
  return {
    signedRelativeThermalResistance:
      (input.lowerLayerDensityKgM3 - input.upperLayerDensityKgM3) /
      input.callerReferenceDensityContrastKgM3,
    stableDensityOrdering:
      input.lowerLayerDensityKgM3 >= input.upperLayerDensityKgM3,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  upperLayerDensityKgM3: 999,
  lowerLayerDensityKgM3: 1000,
  callerReferenceDensityContrastKgM3: 0.2,
} satisfies Input;
export const exampleOutput = {
  signedRelativeThermalResistance: 5,
  stableDensityOrdering: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "limnology/relative-thermal-resistance-mixing",
  title: "Relative Thermal Resistance Mixing Calculator",
  description:
    "Compute caller RTRM density contrast normalized to explicit reference contrast, retaining unstable sign; reference may reflect caller 4–5°C convention, not work/Schmidt stability or a universal mixing threshold.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedRelativeThermalResistance",
      label: "Signed relative thermal resistance",
      kind: "number",
    },
    {
      id: "stableDensityOrdering",
      label: "Stable density ordering",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      upperLayerDensityKgM3: value.upperLayerDensityKgM3 as number,
      lowerLayerDensityKgM3: value.lowerLayerDensityKgM3 as number,
      callerReferenceDensityContrastKgM3:
        value.callerReferenceDensityContrastKgM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
