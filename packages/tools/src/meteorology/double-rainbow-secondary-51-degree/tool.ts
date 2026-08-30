import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";

export type Input = Readonly<{ readonly relativeWaterRefractiveIndex: number }>;
export type Output = Readonly<{
  readonly stationaryIncidenceDegrees: number;
  readonly stationaryDeviationDegrees: number;
  readonly rainbowRadiusFromAntisolarDegrees: number;
}>;
const inputFields = [
  {
    id: "relativeWaterRefractiveIndex",
    label: "Relative water refractive index",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.relativeWaterRefractiveIndex, "relativeWaterRefractiveIndex");
  const n = input.relativeWaterRefractiveIndex,
    k = 2;
  if (n <= 1 || n >= k + 1)
    simpleError(
      "refractiveIndex",
      "Relative index in (1, reflectionCount+1) required for stationary ray.",
    );
  const i = Math.acos(Math.sqrt((n * n - 1) / (k * (k + 2)))),
    r = Math.asin(Math.sin(i) / n),
    d = k * Math.PI + 2 * i - 2 * (k + 1) * r;
  return {
    stationaryIncidenceDegrees: (i * 180) / Math.PI,
    stationaryDeviationDegrees: (d * 180) / Math.PI,
    rainbowRadiusFromAntisolarDegrees: (Math.abs(d - Math.PI) * 180) / Math.PI,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  relativeWaterRefractiveIndex: 1.3333333333333333,
} satisfies Input;
export const exampleOutput = {
  stationaryIncidenceDegrees: 71.83197124269303,
  stationaryDeviationDegrees: 230.97809352567572,
  rainbowRadiusFromAntisolarDegrees: 50.97809352567572,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/double-rainbow-secondary-51-degree",
  title: "Double Rainbow Secondary 51 Degree",
  description:
    "Compute stationary double internal-reflection spherical-drop rainbow ray under caller wavelength-specific refractive index; not a fixed 51 degree lookup or visible bow forecast.",
  inputs: inputFields,
  outputs: [
    {
      id: "stationaryIncidenceDegrees",
      label: "Stationary incidence degrees",
      kind: "number",
    },
    {
      id: "stationaryDeviationDegrees",
      label: "Stationary deviation degrees",
      kind: "number",
    },
    {
      id: "rainbowRadiusFromAntisolarDegrees",
      label: "Rainbow radius from antisolar degrees",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      relativeWaterRefractiveIndex:
        value.relativeWaterRefractiveIndex as number,
    }),
});
export const run = tool.execute;
export default tool;
