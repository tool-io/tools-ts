import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, positive, nonnegative } from "../shared.js";
export type Input = Readonly<{
  readonly observedColumnHeightAboveVentKm: number;
  readonly columnHeightCoefficientKm: number;
  readonly heightPowerExponent: number;
  readonly heightMeasurementBoundsKm: readonly number[];
}>;
export type Output = Readonly<{
  readonly inferredMassEruptionRateKgPerSecond: number;
  readonly measurementScenarioRateBoundsKgPerSecond: readonly number[];
}>;
const inputFields = [
  {
    id: "observedColumnHeightAboveVentKm",
    label: "Observed column height above vent km",
    kind: "number",
  },
  {
    id: "columnHeightCoefficientKm",
    label: "Column height coefficient km",
    kind: "number",
  },
  { id: "heightPowerExponent", label: "Height power exponent", kind: "number" },
  {
    id: "heightMeasurementBoundsKm",
    label: "Height measurement bounds km",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.columnHeightCoefficientKm, "columnHeightCoefficientKm");
  positive(input.heightPowerExponent, "heightPowerExponent");
  nonnegative(
    input.observedColumnHeightAboveVentKm,
    "observedColumnHeightAboveVentKm",
  );
  input.heightMeasurementBoundsKm.forEach((v) =>
    nonnegative(v, "heightMeasurementBoundsKm"),
  );
  if (
    input.heightMeasurementBoundsKm.length !== 2 ||
    input.heightMeasurementBoundsKm[0] >
      input.observedColumnHeightAboveVentKm ||
    input.heightMeasurementBoundsKm[1] < input.observedColumnHeightAboveVentKm
  )
    simpleError(
      "heightMeasurementBoundsKm",
      "Two ordered bounds enclosing observed height required.",
    );
  const invert = (h: number) =>
    (h / input.columnHeightCoefficientKm) ** (1 / input.heightPowerExponent);
  return {
    inferredMassEruptionRateKgPerSecond: invert(
      input.observedColumnHeightAboveVentKm,
    ),
    measurementScenarioRateBoundsKgPerSecond:
      input.heightMeasurementBoundsKm.map(invert),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedColumnHeightAboveVentKm: 4,
  columnHeightCoefficientKm: 2,
  heightPowerExponent: 0.25,
  heightMeasurementBoundsKm: [3, 5],
} satisfies Input;
export const exampleOutput = {
  inferredMassEruptionRateKgPerSecond: 16,
  measurementScenarioRateBoundsKgPerSecond: [5.0625, 39.0625],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "volcanology/mass-eruption-rate-from-column-height",
  title: "Mass Eruption Rate From Column Height",
  description:
    "Invert a supplied column-height calibration and height measurement bounds into mass-rate scenarios; bounds exclude model uncertainty and are not probabilistic confidence intervals.",
  inputs: inputFields,
  outputs: [
    {
      id: "inferredMassEruptionRateKgPerSecond",
      label: "Inferred mass eruption rate kg per second",
      kind: "number",
    },
    {
      id: "measurementScenarioRateBoundsKgPerSecond",
      label: "Measurement scenario rate bounds kg per second",
      kind: "numberList",
    },
  ],
  calculate: (value) =>
    calculate({
      observedColumnHeightAboveVentKm:
        value.observedColumnHeightAboveVentKm as number,
      columnHeightCoefficientKm: value.columnHeightCoefficientKm as number,
      heightPowerExponent: value.heightPowerExponent as number,
      heightMeasurementBoundsKm:
        value.heightMeasurementBoundsKm as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
