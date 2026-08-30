import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, fraction } from "../shared.js";
export type Input = Readonly<{
  readonly measuredPulpDensityKgPerM3: number;
  readonly solidDensityKgPerM3: number;
  readonly liquidDensityKgPerM3: number;
}>;
export type Output = Readonly<{
  readonly inferredSolidMassPercent: number;
  readonly inferredSolidVolumeFraction: number;
}>;
const inputFields = [
  {
    id: "measuredPulpDensityKgPerM3",
    label: "Measured pulp density kg per m3",
    kind: "number",
  },
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
  positive(input.measuredPulpDensityKgPerM3, "measuredPulpDensityKgPerM3");
  positive(input.solidDensityKgPerM3, "solidDensityKgPerM3");
  positive(input.liquidDensityKgPerM3, "liquidDensityKgPerM3");
  if (input.solidDensityKgPerM3 === input.liquidDensityKgPerM3)
    simpleError(
      "solidDensityKgPerM3",
      "Distinct densities required for identifiable inversion.",
    );
  const phi = fraction(
    (input.measuredPulpDensityKgPerM3 - input.liquidDensityKgPerM3) /
      (input.solidDensityKgPerM3 - input.liquidDensityKgPerM3),
    "measuredPulpDensityKgPerM3",
  );
  return {
    inferredSolidMassPercent:
      (100 * phi * input.solidDensityKgPerM3) /
      input.measuredPulpDensityKgPerM3,
    inferredSolidVolumeFraction: phi,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  measuredPulpDensityKgPerM3: 1500,
  solidDensityKgPerM3: 3000,
  liquidDensityKgPerM3: 1000,
} satisfies Input;
export const exampleOutput = {
  inferredSolidMassPercent: 50,
  inferredSolidVolumeFraction: 0.25,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/pulp-percent-solids-from-density",
  title: "Pulp Percent Solids From Density",
  description:
    "Invert additive-volume pulp density to solid mass percent/volume fraction; measured density must lie between distinct component densities.",
  inputs: inputFields,
  outputs: [
    {
      id: "inferredSolidMassPercent",
      label: "Inferred solid mass percent",
      kind: "number",
    },
    {
      id: "inferredSolidVolumeFraction",
      label: "Inferred solid volume fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      measuredPulpDensityKgPerM3: value.measuredPulpDensityKgPerM3 as number,
      solidDensityKgPerM3: value.solidDensityKgPerM3 as number,
      liquidDensityKgPerM3: value.liquidDensityKgPerM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
