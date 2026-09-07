import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  fraction,
  aligned,
  interpolate,
  ordered,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly observedPhaseCompositionFractions: readonly number[];
  readonly observedSolidusKelvin: readonly number[];
  readonly observedLiquidusKelvin: readonly number[];
  readonly queryCompositionFraction: number;
}>;
export type Output = Readonly<{
  readonly interpolatedSolidusKelvin: number;
  readonly interpolatedLiquidusKelvin: number;
  readonly observedMushyZoneWidthKelvin: number;
}>;
const inputFields = [
  {
    id: "observedPhaseCompositionFractions",
    label: "Observed phase composition fractions",
    kind: "numberList",
  },
  {
    id: "observedSolidusKelvin",
    label: "Observed solidus kelvin",
    kind: "numberList",
  },
  {
    id: "observedLiquidusKelvin",
    label: "Observed liquidus kelvin",
    kind: "numberList",
  },
  {
    id: "queryCompositionFraction",
    label: "Query composition fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.observedSolidusKelvin.forEach((v) =>
    positive(v, "observedSolidusKelvin"),
  );
  input.observedLiquidusKelvin.forEach((v) =>
    positive(v, "observedLiquidusKelvin"),
  );
  input.observedPhaseCompositionFractions.forEach((v) =>
    fraction(v, "observedPhaseCompositionFractions"),
  );
  fraction(input.queryCompositionFraction, "queryCompositionFraction");
  aligned(
    input.observedPhaseCompositionFractions,
    input.observedLiquidusKelvin,
    "observedPhaseCompositionFractions",
  );
  aligned(
    input.observedPhaseCompositionFractions,
    input.observedSolidusKelvin,
    "phase",
  );
  input.observedSolidusKelvin.forEach((v, i) =>
    ordered(v, input.observedLiquidusKelvin[i], "phase"),
  );
  const s = interpolate(
      input.observedPhaseCompositionFractions,
      input.observedSolidusKelvin,
      input.queryCompositionFraction,
    ),
    l = interpolate(
      input.observedPhaseCompositionFractions,
      input.observedLiquidusKelvin,
      input.queryCompositionFraction,
    );
  return {
    interpolatedSolidusKelvin: s,
    interpolatedLiquidusKelvin: l,
    observedMushyZoneWidthKelvin: l - s,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPhaseCompositionFractions: [0, 0.5, 1],
  observedSolidusKelvin: [100, 80, 100],
  observedLiquidusKelvin: [120, 100, 120],
  queryCompositionFraction: 0.25,
} satisfies Input;
export const exampleOutput = {
  interpolatedSolidusKelvin: 90,
  interpolatedLiquidusKelvin: 110,
  observedMushyZoneWidthKelvin: 20,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "semiconductor/solidus-liquidus-temperature",
  title: "Semiconductor Solidus Liquidus Temperature Calculator",
  description:
    "Read independently established sampled solidus/liquidus paired phase boundaries, no extrapolation or alloy thermal processing advice; not a fixed melting-point lookup.",
  inputs: inputFields,
  outputs: [
    {
      id: "interpolatedSolidusKelvin",
      label: "Interpolated solidus kelvin",
      kind: "number",
    },
    {
      id: "interpolatedLiquidusKelvin",
      label: "Interpolated liquidus kelvin",
      kind: "number",
    },
    {
      id: "observedMushyZoneWidthKelvin",
      label: "Observed mushy zone width kelvin",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPhaseCompositionFractions:
        value.observedPhaseCompositionFractions as readonly number[],
      observedSolidusKelvin: value.observedSolidusKelvin as readonly number[],
      observedLiquidusKelvin: value.observedLiquidusKelvin as readonly number[],
      queryCompositionFraction: value.queryCompositionFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
