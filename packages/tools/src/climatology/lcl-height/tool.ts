import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive } from "../shared.js";

export type Input = Readonly<{
  readonly parcelTemperatureK: number;
  readonly parcelDewpointK: number;
  readonly surfacePressureHpa: number;
  readonly dryGasConstantJPerKgK: number;
  readonly dryHeatCapacityJPerKgK: number;
  readonly gravityMPerSecondSquared: number;
}>;
export type Output = Readonly<{
  readonly boltonLclTemperatureK: number;
  readonly dryAdiabaticLclPressureHpa: number;
  readonly dryAdiabaticLclHeightM: number;
}>;
const inputFields = [
  { id: "parcelTemperatureK", label: "Parcel temperature k", kind: "number" },
  { id: "parcelDewpointK", label: "Parcel dewpoint k", kind: "number" },
  { id: "surfacePressureHpa", label: "Surface pressure hpa", kind: "number" },
  {
    id: "dryGasConstantJPerKgK",
    label: "Dry gas constant j per kg k",
    kind: "number",
  },
  {
    id: "dryHeatCapacityJPerKgK",
    label: "Dry heat capacity j per kg k",
    kind: "number",
  },
  {
    id: "gravityMPerSecondSquared",
    label: "Gravity m per second squared",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.parcelTemperatureK, "parcelTemperatureK");
  positive(input.parcelDewpointK, "parcelDewpointK");
  positive(input.surfacePressureHpa, "surfacePressureHpa");
  positive(input.dryGasConstantJPerKgK, "dryGasConstantJPerKgK");
  positive(input.dryHeatCapacityJPerKgK, "dryHeatCapacityJPerKgK");
  positive(input.gravityMPerSecondSquared, "gravityMPerSecondSquared");
  if (
    input.parcelDewpointK > input.parcelTemperatureK ||
    input.parcelDewpointK <= 56
  )
    simpleError(
      "dewpoint",
      "Physical dewpoint at/below parcel temperature and above Bolton singularity required.",
    );
  const boltonLclTemperatureK =
    1 /
      (1 / (input.parcelDewpointK - 56) +
        Math.log(input.parcelTemperatureK / input.parcelDewpointK) / 800) +
    56;
  return {
    boltonLclTemperatureK,
    dryAdiabaticLclPressureHpa:
      input.surfacePressureHpa *
      (boltonLclTemperatureK / input.parcelTemperatureK) **
        (input.dryHeatCapacityJPerKgK / input.dryGasConstantJPerKgK),
    dryAdiabaticLclHeightM:
      ((input.parcelTemperatureK - boltonLclTemperatureK) *
        input.dryHeatCapacityJPerKgK) /
      input.gravityMPerSecondSquared,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  parcelTemperatureK: 300,
  parcelDewpointK: 300,
  surfacePressureHpa: 1000,
  dryGasConstantJPerKgK: 287,
  dryHeatCapacityJPerKgK: 1004,
  gravityMPerSecondSquared: 9.81,
} satisfies Input;
export const exampleOutput = {
  boltonLclTemperatureK: 300,
  dryAdiabaticLclPressureHpa: 1000,
  dryAdiabaticLclHeightM: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/lcl-height",
  title: "Lifting Condensation Level Height",
  description:
    "Compute named Bolton LCL temperature then caller dry-adiabatic pressure/height for a surface parcel; not existing dewpoint-spread fog proxy, inferred environmental cloud base or moist-convective ascent.",
  inputs: inputFields,
  outputs: [
    {
      id: "boltonLclTemperatureK",
      label: "Bolton lcl temperature k",
      kind: "number",
    },
    {
      id: "dryAdiabaticLclPressureHpa",
      label: "Dry adiabatic lcl pressure hpa",
      kind: "number",
    },
    {
      id: "dryAdiabaticLclHeightM",
      label: "Dry adiabatic lcl height m",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      parcelTemperatureK: value.parcelTemperatureK as number,
      parcelDewpointK: value.parcelDewpointK as number,
      surfacePressureHpa: value.surfacePressureHpa as number,
      dryGasConstantJPerKgK: value.dryGasConstantJPerKgK as number,
      dryHeatCapacityJPerKgK: value.dryHeatCapacityJPerKgK as number,
      gravityMPerSecondSquared: value.gravityMPerSecondSquared as number,
    }),
});
export const run = tool.execute;
export default tool;
