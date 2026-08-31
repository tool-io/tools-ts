import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch32-shared.js";
export type Input = Readonly<{
  readonly totalIceThicknessM: number;
  readonly submergedDraftM: number;
  readonly iceDensityKgM3: number;
  readonly waterDensityKgM3: number;
}>;
export type Output = Readonly<{
  readonly buoyantSupportToIceWeightFraction: number;
  readonly unsupportedWeightFraction: number;
  readonly buoyancyExceedsIceWeight: boolean;
}>;
const inputFields = [
  { id: "totalIceThicknessM", label: "Total ice thickness m", kind: "number" },
  { id: "submergedDraftM", label: "Submerged draft m", kind: "number" },
  { id: "iceDensityKgM3", label: "Ice density kg m3", kind: "number" },
  { id: "waterDensityKgM3", label: "Water density kg m3", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.totalIceThicknessM, "totalIceThicknessM");
  positive(input.iceDensityKgM3, "iceDensityKgM3");
  positive(input.waterDensityKgM3, "waterDensityKgM3");
  nonnegative(input.submergedDraftM, "submergedDraftM");
  if (input.submergedDraftM > input.totalIceThicknessM)
    simpleError("draft", "Draft must not exceed total thickness.");
  const support =
    (input.waterDensityKgM3 / input.iceDensityKgM3) *
    (input.submergedDraftM / input.totalIceThicknessM);
  return {
    buoyantSupportToIceWeightFraction: support,
    unsupportedWeightFraction: 1 - support,
    buoyancyExceedsIceWeight: support > 1,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  totalIceThicknessM: 100,
  submergedDraftM: 80,
  iceDensityKgM3: 900,
  waterDensityKgM3: 1000,
} satisfies Input;
export const exampleOutput = {
  buoyantSupportToIceWeightFraction: 0.8888888888888888,
  unsupportedWeightFraction: 0.1111111111111111,
  buoyancyExceedsIceWeight: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/flotation-fraction-buoyancy",
  title: "Flotation Fraction Buoyancy Calculator",
  description:
    "Audit supplied draft/thickness buoyant support fraction with signed unsupported weight; not thickness inversion or a floating/grounded stability guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "buoyantSupportToIceWeightFraction",
      label: "Buoyant support to ice weight fraction",
      kind: "number",
    },
    {
      id: "unsupportedWeightFraction",
      label: "Unsupported weight fraction",
      kind: "number",
    },
    {
      id: "buoyancyExceedsIceWeight",
      label: "Buoyancy exceeds ice weight",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      totalIceThicknessM: value.totalIceThicknessM as number,
      submergedDraftM: value.submergedDraftM as number,
      iceDensityKgM3: value.iceDensityKgM3 as number,
      waterDensityKgM3: value.waterDensityKgM3 as number,
    }),
});
export const run = tool.execute;
export default tool;
