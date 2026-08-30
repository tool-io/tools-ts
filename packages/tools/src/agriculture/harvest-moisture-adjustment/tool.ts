import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
  aligned,
} from "../shared.js";
export type Input = Readonly<{
  readonly harvestLotWetMassesKg: readonly number[];
  readonly harvestLotMoistureFractions: readonly number[];
  readonly retainedDryMatterFractions: readonly number[];
  readonly reportingMoistureFraction: number;
}>;
export type Output = Readonly<{
  readonly totalOriginalDryMatterKg: number;
  readonly totalRetainedDryMatterKg: number;
  readonly reportingBasisHarvestMassKg: number;
  readonly dryMatterLossKg: number;
}>;
const inputFields = [
  {
    id: "harvestLotWetMassesKg",
    label: "Harvest lot wet masses kg",
    kind: "numberList",
  },
  {
    id: "harvestLotMoistureFractions",
    label: "Harvest lot moisture fractions",
    kind: "numberList",
  },
  {
    id: "retainedDryMatterFractions",
    label: "Retained dry matter fractions",
    kind: "numberList",
  },
  {
    id: "reportingMoistureFraction",
    label: "Reporting moisture fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.harvestLotWetMassesKg.forEach((v) =>
    nonnegative(v, "harvestLotWetMassesKg"),
  );
  input.harvestLotMoistureFractions.forEach((v) =>
    fraction(v, "harvestLotMoistureFractions"),
  );
  input.retainedDryMatterFractions.forEach((v) =>
    fraction(v, "retainedDryMatterFractions"),
  );
  fraction(input.reportingMoistureFraction, "reportingMoistureFraction");
  aligned(
    input.harvestLotWetMassesKg,
    input.harvestLotMoistureFractions,
    "harvestLotWetMassesKg",
  );
  aligned(
    input.harvestLotWetMassesKg,
    input.retainedDryMatterFractions,
    "harvestLotWetMassesKg",
  );
  if (
    input.reportingMoistureFraction === 1 ||
    input.harvestLotMoistureFractions.some((v) => v === 1)
  )
    simpleError("moisture", "Harvest/reporting moisture below one required.");
  const dry = input.harvestLotWetMassesKg.map(
      (v, i) => v * (1 - input.harvestLotMoistureFractions[i]),
    ),
    totalOriginalDryMatterKg = dry.reduce((a, b) => a + b, 0),
    totalRetainedDryMatterKg = dry.reduce(
      (s, v, i) => s + v * input.retainedDryMatterFractions[i],
      0,
    );
  return {
    totalOriginalDryMatterKg,
    totalRetainedDryMatterKg,
    reportingBasisHarvestMassKg:
      totalRetainedDryMatterKg / (1 - input.reportingMoistureFraction),
    dryMatterLossKg: totalOriginalDryMatterKg - totalRetainedDryMatterKg,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  harvestLotWetMassesKg: [100, 200],
  harvestLotMoistureFractions: [0.2, 0.1],
  retainedDryMatterFractions: [0.9, 1],
  reportingMoistureFraction: 0.1,
} satisfies Input;
export const exampleOutput = {
  totalOriginalDryMatterKg: 260,
  totalRetainedDryMatterKg: 252,
  reportingBasisHarvestMassKg: 280,
  dryMatterLossKg: 8,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "agriculture/harvest-moisture-adjustment",
  title: "Agriculture Harvest Moisture Adjustment",
  description:
    "Account harvested lots with differing wet-basis moisture and explicitly retained dry matter before reporting-basis mass; unlike standalone moisture conversion, actual graded/handling dry-matter loss is separately conserved.",
  inputs: inputFields,
  outputs: [
    {
      id: "totalOriginalDryMatterKg",
      label: "Total original dry matter kg",
      kind: "number",
    },
    {
      id: "totalRetainedDryMatterKg",
      label: "Total retained dry matter kg",
      kind: "number",
    },
    {
      id: "reportingBasisHarvestMassKg",
      label: "Reporting basis harvest mass kg",
      kind: "number",
    },
    { id: "dryMatterLossKg", label: "Dry matter loss kg", kind: "number" },
  ],
  calculate: (value) =>
    calculate({
      harvestLotWetMassesKg: value.harvestLotWetMassesKg as readonly number[],
      harvestLotMoistureFractions:
        value.harvestLotMoistureFractions as readonly number[],
      retainedDryMatterFractions:
        value.retainedDryMatterFractions as readonly number[],
      reportingMoistureFraction: value.reportingMoistureFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
