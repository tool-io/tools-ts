import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";

export type Input = Readonly<{
  readonly coldAirTemperatureK: number;
  readonly warmAirTemperatureK: number;
  readonly coldAirAlongFrontWindMPerSecond: number;
  readonly warmAirAlongFrontWindMPerSecond: number;
  readonly coriolisPerSecond: number;
  readonly gravityMPerSecondSquared: number;
}>;
export type Output = Readonly<{ readonly signedMargulesFrontalSlope: number }>;
const inputFields = [
  {
    id: "coldAirTemperatureK",
    label: "Cold air temperature k",
    kind: "number",
  },
  {
    id: "warmAirTemperatureK",
    label: "Warm air temperature k",
    kind: "number",
  },
  {
    id: "coldAirAlongFrontWindMPerSecond",
    label: "Cold air along front wind m per second",
    kind: "number",
  },
  {
    id: "warmAirAlongFrontWindMPerSecond",
    label: "Warm air along front wind m per second",
    kind: "number",
  },
  { id: "coriolisPerSecond", label: "Coriolis per second", kind: "number" },
  {
    id: "gravityMPerSecondSquared",
    label: "Gravity m per second squared",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.coldAirTemperatureK, "coldAirTemperatureK");
  positive(input.warmAirTemperatureK, "warmAirTemperatureK");
  positive(input.gravityMPerSecondSquared, "gravityMPerSecondSquared");
  if (
    input.warmAirTemperatureK <= input.coldAirTemperatureK ||
    input.coriolisPerSecond === 0
  )
    simpleError(
      "front",
      "Positive thermal contrast and nonzero Coriolis required.",
    );
  return {
    signedMargulesFrontalSlope:
      (input.coriolisPerSecond *
        (input.coldAirTemperatureK * input.warmAirAlongFrontWindMPerSecond -
          input.warmAirTemperatureK * input.coldAirAlongFrontWindMPerSecond)) /
      (input.gravityMPerSecondSquared *
        (input.warmAirTemperatureK - input.coldAirTemperatureK)),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  coldAirTemperatureK: 280,
  warmAirTemperatureK: 300,
  coldAirAlongFrontWindMPerSecond: 5,
  warmAirAlongFrontWindMPerSecond: 10,
  coriolisPerSecond: 0.0001,
  gravityMPerSecondSquared: 10,
} satisfies Input;
export const exampleOutput = {
  signedMargulesFrontalSlope: 0.00065,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "meteorology/frontal-slope-margules-formula",
  title: "Frontal Slope Margules Formula",
  description:
    "Evaluate signed Margules temperature-weighted along-front geostrophic-wind slope under declared uniform two-air-mass convention; not frontal motion or an observed frontal elevation map.",
  inputs: inputFields,
  outputs: [
    {
      id: "signedMargulesFrontalSlope",
      label: "Signed margules frontal slope",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      coldAirTemperatureK: value.coldAirTemperatureK as number,
      warmAirTemperatureK: value.warmAirTemperatureK as number,
      coldAirAlongFrontWindMPerSecond:
        value.coldAirAlongFrontWindMPerSecond as number,
      warmAirAlongFrontWindMPerSecond:
        value.warmAirAlongFrontWindMPerSecond as number,
      coriolisPerSecond: value.coriolisPerSecond as number,
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
    }),
});
export const run = tool.execute;
export default tool;
