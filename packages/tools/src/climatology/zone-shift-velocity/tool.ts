import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, norm } from "../shared.js";

export type Input = Readonly<{
  readonly temporalClimateChangeCPerYear: number;
  readonly spatialTemperatureGradientCPerKm: readonly number[];
}>;
export type Output = Readonly<{
  readonly minimumNormClimateVelocityKmPerYear: readonly number[];
  readonly climateVelocityMagnitudeKmPerYear: number;
}>;
const inputFields = [
  {
    id: "temporalClimateChangeCPerYear",
    label: "Temporal climate change c per year",
    kind: "number",
  },
  {
    id: "spatialTemperatureGradientCPerKm",
    label: "Spatial temperature gradient c per km",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  if (input.spatialTemperatureGradientCPerKm.length !== 2)
    simpleError(
      "gradient",
      "Caller measured planar east/north climate gradient required.",
    );
  const g = norm(input.spatialTemperatureGradientCPerKm);
  positive(g, "spatialGradient");
  const scale = -input.temporalClimateChangeCPerYear / g;
  const minimumNormClimateVelocityKmPerYear =
    input.spatialTemperatureGradientCPerKm.map((v) => scale * (v / g));
  return {
    minimumNormClimateVelocityKmPerYear,
    climateVelocityMagnitudeKmPerYear: norm(
      minimumNormClimateVelocityKmPerYear,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  temporalClimateChangeCPerYear: 0.02,
  spatialTemperatureGradientCPerKm: [0.01, 0],
} satisfies Input;
export const exampleOutput = {
  minimumNormClimateVelocityKmPerYear: [-2, 0],
  climateVelocityMagnitudeKmPerYear: 2,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/zone-shift-velocity",
  title: "Climate Zone Shift Velocity",
  description:
    "Solve minimum-norm isotherm velocity from caller temporal tendency and planar measured temperature gradient; sign follows dT/dt+v·gradT=0, not mapped migration, species movement or a geodesy operation.",
  inputs: inputFields,
  outputs: [
    {
      id: "minimumNormClimateVelocityKmPerYear",
      label: "Minimum norm climate velocity km per year",
      kind: "numberList",
    },
    {
      id: "climateVelocityMagnitudeKmPerYear",
      label: "Climate velocity magnitude km per year",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      temporalClimateChangeCPerYear:
        value.temporalClimateChangeCPerYear as number,
      spatialTemperatureGradientCPerKm:
        value.spatialTemperatureGradientCPerKm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
