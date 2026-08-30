import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly subcatchmentAreasHa: readonly number[];
  readonly clearcutAreasHa: readonly number[];
  readonly callerMaximumCutFractions: readonly number[];
}>;
export type Output = Readonly<{
  readonly subcatchmentClearcutFractions: readonly number[];
  readonly aboveCallerThresholdFlags: readonly number[];
  readonly wholeWatershedClearcutFraction: number;
}>;
const inputFields = [
  {
    id: "subcatchmentAreasHa",
    label: "Subcatchment areas ha",
    kind: "numberList",
  },
  { id: "clearcutAreasHa", label: "Clearcut areas ha", kind: "numberList" },
  {
    id: "callerMaximumCutFractions",
    label: "Caller maximum cut fractions",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.subcatchmentAreasHa.forEach((v) => positive(v, "subcatchmentAreasHa"));
  input.clearcutAreasHa.forEach((v) => nonnegative(v, "clearcutAreasHa"));
  input.callerMaximumCutFractions.forEach((v) =>
    fraction(v, "callerMaximumCutFractions"),
  );
  aligned(
    input.subcatchmentAreasHa,
    input.clearcutAreasHa,
    "subcatchmentAreasHa",
  );
  aligned(
    input.subcatchmentAreasHa,
    input.callerMaximumCutFractions,
    "subcatchmentAreasHa",
  );
  const subcatchmentClearcutFractions = input.clearcutAreasHa.map((v, i) =>
    fraction(v / input.subcatchmentAreasHa[i], "clearcutAreasHa"),
  );
  return {
    subcatchmentClearcutFractions,
    aboveCallerThresholdFlags: subcatchmentClearcutFractions.map((v, i) =>
      v > input.callerMaximumCutFractions[i] ? 1 : 0,
    ),
    wholeWatershedClearcutFraction:
      input.clearcutAreasHa.reduce((a, b) => a + b, 0) /
      input.subcatchmentAreasHa.reduce((a, b) => a + b, 0),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  subcatchmentAreasHa: [100, 200],
  clearcutAreasHa: [10, 80],
  callerMaximumCutFractions: [0.2, 0.3],
} satisfies Input;
export const exampleOutput = {
  subcatchmentClearcutFractions: [0.1, 0.4],
  aboveCallerThresholdFlags: [0, 1],
  wholeWatershedClearcutFraction: 0.3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "forestry/watershed-clearcut-percent-threshold-checker",
  title: "Watershed Clearcut Percent Threshold Checker",
  description:
    "Audit independently supplied nonoverlapping subcatchment clearcut inventories against caller thresholds and aggregate area, preserving local exceedances; no watershed routing or regulatory/hydrological safety certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "subcatchmentClearcutFractions",
      label: "Subcatchment clearcut fractions",
      kind: "numberList",
    },
    {
      id: "aboveCallerThresholdFlags",
      label: "Above caller threshold flags",
      kind: "numberList",
    },
    {
      id: "wholeWatershedClearcutFraction",
      label: "Whole watershed clearcut fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      subcatchmentAreasHa: value.subcatchmentAreasHa as readonly number[],
      clearcutAreasHa: value.clearcutAreasHa as readonly number[],
      callerMaximumCutFractions:
        value.callerMaximumCutFractions as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
