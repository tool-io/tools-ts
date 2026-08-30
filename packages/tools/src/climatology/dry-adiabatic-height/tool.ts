import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";

export type Input = Readonly<{
  readonly initialParcelTemperatureK: number;
  readonly heightChangesM: readonly number[];
  readonly gravityMPerSecondSquared: number;
  readonly dryHeatCapacityJPerKgK: number;
}>;
export type Output = Readonly<{
  readonly dryAdiabaticEndpointTemperaturesK: readonly number[];
  readonly netDryAdiabaticTemperatureChangeK: number;
}>;
const inputFields = [
  {
    id: "initialParcelTemperatureK",
    label: "Initial parcel temperature k",
    kind: "number",
  },
  { id: "heightChangesM", label: "Height changes m", kind: "numberList" },
  {
    id: "gravityMPerSecondSquared",
    label: "Gravity m per second squared",
    kind: "number",
  },
  {
    id: "dryHeatCapacityJPerKgK",
    label: "Dry heat capacity j per kg k",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.initialParcelTemperatureK, "initialParcelTemperatureK");
  positive(input.gravityMPerSecondSquared, "gravityMPerSecondSquared");
  positive(input.dryHeatCapacityJPerKgK, "dryHeatCapacityJPerKgK");
  if (!input.heightChangesM.length)
    simpleError(
      "path",
      "At least one declared dry unsaturated displacement required.",
    );
  let t = input.initialParcelTemperatureK;
  const dryAdiabaticEndpointTemperaturesK = input.heightChangesM.map((dz) => {
    t -= (input.gravityMPerSecondSquared * dz) / input.dryHeatCapacityJPerKgK;
    return positive(t, "parcelTemperature");
  });
  return {
    dryAdiabaticEndpointTemperaturesK,
    netDryAdiabaticTemperatureChangeK: t - input.initialParcelTemperatureK,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  initialParcelTemperatureK: 300,
  heightChangesM: [1000, -500],
  gravityMPerSecondSquared: 10,
  dryHeatCapacityJPerKgK: 1000,
} satisfies Input;
export const exampleOutput = {
  dryAdiabaticEndpointTemperaturesK: [290, 295],
  netDryAdiabaticTemperatureChangeK: -5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/dry-adiabatic-height",
  title: "Dry Adiabatic Height Change",
  description:
    "Track signed dry parcel temperature changes through an explicit unsaturated displacement path with supplied g/cp; unlike measured environmental lapse, no condensation or ground-clearance/safe-flight inference.",
  inputs: inputFields,
  outputs: [
    {
      id: "dryAdiabaticEndpointTemperaturesK",
      label: "Dry adiabatic endpoint temperatures k",
      kind: "numberList",
    },
    {
      id: "netDryAdiabaticTemperatureChangeK",
      label: "Net dry adiabatic temperature change k",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      initialParcelTemperatureK: value.initialParcelTemperatureK as number,
      heightChangesM: value.heightChangesM as readonly number[],
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
      dryHeatCapacityJPerKgK: value.dryHeatCapacityJPerKgK as number,
    }),
});
export const run = tool.execute;
export default tool;
