import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly massEruptionRateKgPerSecond: number;
  readonly columnHeightCoefficientKm: number;
  readonly heightPowerExponent: number;
  readonly ventElevationKm: number;
}>;
export type Output = Readonly<{
  readonly modelColumnHeightAboveVentKm: number;
  readonly modelColumnTopElevationKm: number;
}>;
const inputFields = [
  {
    id: "massEruptionRateKgPerSecond",
    label: "Mass eruption rate kg per second",
    kind: "number",
  },
  {
    id: "columnHeightCoefficientKm",
    label: "Column height coefficient km",
    kind: "number",
  },
  { id: "heightPowerExponent", label: "Height power exponent", kind: "number" },
  { id: "ventElevationKm", label: "Vent elevation km", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.columnHeightCoefficientKm, "columnHeightCoefficientKm");
  positive(input.heightPowerExponent, "heightPowerExponent");
  nonnegative(input.massEruptionRateKgPerSecond, "massEruptionRateKgPerSecond");
  const modelColumnHeightAboveVentKm =
    input.columnHeightCoefficientKm *
    input.massEruptionRateKgPerSecond ** input.heightPowerExponent;
  return {
    modelColumnHeightAboveVentKm,
    modelColumnTopElevationKm:
      input.ventElevationKm + modelColumnHeightAboveVentKm,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  massEruptionRateKgPerSecond: 16,
  columnHeightCoefficientKm: 2,
  heightPowerExponent: 0.25,
  ventElevationKm: 1,
} satisfies Input;
export const exampleOutput = {
  modelColumnHeightAboveVentKm: 4,
  modelColumnTopElevationKm: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/eruption-column-height-estimation",
  title: "Eruption Column Height Estimation",
  description:
    "Predict a calibrated power-law eruption column height above vent and datum elevation; coefficient units follow supplied exponent and no wind/eruption-style-independent plume law is guaranteed.",
  inputs: inputFields,
  outputs: [
    {
      id: "modelColumnHeightAboveVentKm",
      label: "Model column height above vent km",
      kind: "number",
    },
    {
      id: "modelColumnTopElevationKm",
      label: "Model column top elevation km",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      massEruptionRateKgPerSecond: value.massEruptionRateKgPerSecond as number,
      columnHeightCoefficientKm: value.columnHeightCoefficientKm as number,
      heightPowerExponent: value.heightPowerExponent as number,
      ventElevationKm: value.ventElevationKm as number,
    }),
});
export const run = tool.execute;
export default tool;
