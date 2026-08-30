import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
  count,
} from "../shared.js";
export type Input = Readonly<{
  readonly usableCombWidthCm: number;
  readonly usableCombHeightCm: number;
  readonly sectionWidthCm: number;
  readonly sectionHeightCm: number;
  readonly cutGapCm: number;
  readonly marketableFraction: number;
}>;
export type Output = Readonly<{
  readonly sectionCapacity: number;
  readonly chosenRotationCode: number;
  readonly plannedMarketableSections: number;
  readonly sectionAreaUtilizationFraction: number;
}>;
const inputFields = [
  { id: "usableCombWidthCm", label: "Usable comb width cm", kind: "number" },
  { id: "usableCombHeightCm", label: "Usable comb height cm", kind: "number" },
  { id: "sectionWidthCm", label: "Section width cm", kind: "number" },
  { id: "sectionHeightCm", label: "Section height cm", kind: "number" },
  { id: "cutGapCm", label: "Cut gap cm", kind: "number" },
  { id: "marketableFraction", label: "Marketable fraction", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.usableCombWidthCm, "usableCombWidthCm");
  positive(input.usableCombHeightCm, "usableCombHeightCm");
  positive(input.sectionWidthCm, "sectionWidthCm");
  positive(input.sectionHeightCm, "sectionHeightCm");
  nonnegative(input.cutGapCm, "cutGapCm");
  fraction(input.marketableFraction, "marketableFraction");
  const cap = (w: number, h: number) =>
      count(
        Math.floor(
          (input.usableCombWidthCm + input.cutGapCm) / (w + input.cutGapCm),
        ) *
          Math.floor(
            (input.usableCombHeightCm + input.cutGapCm) / (h + input.cutGapCm),
          ),
        "sectionCapacity",
      ),
    a = cap(input.sectionWidthCm, input.sectionHeightCm),
    b = cap(input.sectionHeightCm, input.sectionWidthCm),
    sectionCapacity = Math.max(a, b);
  return {
    sectionCapacity,
    chosenRotationCode: b > a ? 1 : 0,
    plannedMarketableSections: Math.floor(
      sectionCapacity * input.marketableFraction,
    ),
    sectionAreaUtilizationFraction:
      (sectionCapacity * input.sectionWidthCm * input.sectionHeightCm) /
      (input.usableCombWidthCm * input.usableCombHeightCm),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  usableCombWidthCm: 20,
  usableCombHeightCm: 20,
  sectionWidthCm: 4,
  sectionHeightCm: 5,
  cutGapCm: 0,
  marketableFraction: 0.8,
} satisfies Input;
export const exampleOutput = {
  sectionCapacity: 20,
  chosenRotationCode: 0,
  plannedMarketableSections: 16,
  sectionAreaUtilizationFraction: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/comb-honey-sections-per-super",
  title: "Comb Honey Sections Per Super",
  description:
    "Plan an axis-aligned comb-section cut grid with gaps and both rotations; ties keep supplied orientation and marketable fraction is a caller planning estimate.",
  inputs: inputFields,
  outputs: [
    { id: "sectionCapacity", label: "Section capacity", kind: "number" },
    { id: "chosenRotationCode", label: "Chosen rotation code", kind: "number" },
    {
      id: "plannedMarketableSections",
      label: "Planned marketable sections",
      kind: "number",
    },
    {
      id: "sectionAreaUtilizationFraction",
      label: "Section area utilization fraction",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      usableCombWidthCm: value.usableCombWidthCm as number,
      usableCombHeightCm: value.usableCombHeightCm as number,
      sectionWidthCm: value.sectionWidthCm as number,
      sectionHeightCm: value.sectionHeightCm as number,
      cutGapCm: value.cutGapCm as number,
      marketableFraction: value.marketableFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
