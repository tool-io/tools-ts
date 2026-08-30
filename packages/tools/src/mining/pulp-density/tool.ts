import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, fraction } from "../shared.js";
export type Input = Readonly<{
  readonly solidMassFraction: number;
  readonly solidDensityKgPerM3: number;
  readonly liquidDensityKgPerM3: number;
}>;
export type Output = Readonly<{
  readonly pulpDensityKgPerM3: number;
  readonly solidVolumeFraction: number;
}>;
const inputFields = [
  { id: "solidMassFraction", label: "Solid mass fraction", kind: "number" },
  {
    id: "solidDensityKgPerM3",
    label: "Solid density kg per m3",
    kind: "number",
  },
  {
    id: "liquidDensityKgPerM3",
    label: "Liquid density kg per m3",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.solidDensityKgPerM3, "solidDensityKgPerM3");
  positive(input.liquidDensityKgPerM3, "liquidDensityKgPerM3");
  fraction(input.solidMassFraction, "solidMassFraction");
  const volume =
    input.solidMassFraction / input.solidDensityKgPerM3 +
    (1 - input.solidMassFraction) / input.liquidDensityKgPerM3;
  return {
    pulpDensityKgPerM3: 1 / volume,
    solidVolumeFraction:
      input.solidMassFraction / input.solidDensityKgPerM3 / volume,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  solidMassFraction: 0.5,
  solidDensityKgPerM3: 3000,
  liquidDensityKgPerM3: 1000,
} satisfies Input;
export const exampleOutput = {
  pulpDensityKgPerM3: 1500,
  solidVolumeFraction: 0.25,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/pulp-density",
  title: "Pulp Density",
  description:
    "Calculate ideal mixture density and solids volume fraction with additive component volumes; gas entrainment and volume contraction are excluded.",
  inputs: inputFields,
  outputs: [
    {
      id: "pulpDensityKgPerM3",
      label: "Pulp density kg per m3",
      kind: "number",
    },
    {
      id: "solidVolumeFraction",
      label: "Solid volume fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      solidMassFraction: value.solidMassFraction as number,
      solidDensityKgPerM3: value.solidDensityKgPerM3 as number,
      liquidDensityKgPerM3: value.liquidDensityKgPerM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
