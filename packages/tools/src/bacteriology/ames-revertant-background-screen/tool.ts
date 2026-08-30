import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
import { positive, fraction, count, mean } from "../shared.js";

export type Input = Readonly<{
  readonly treatedRevertantCounts: readonly number[];
  readonly controlRevertantCounts: readonly number[];
  readonly minimumFoldIncrease: number;
  readonly treatedViabilityFraction: number;
  readonly minimumValidViability: number;
}>;
export type Output = Readonly<{
  readonly meanTreatedRevertants: number;
  readonly meanControlRevertants: number;
  readonly backgroundFoldIncrease: number;
  readonly assayViabilityAdequate: boolean;
  readonly screenFlag: boolean;
}>;
export const calculate = (input: Input): Output => {
  input.treatedRevertantCounts.forEach((v) =>
    count(v, "treatedRevertantCounts"),
  );
  input.controlRevertantCounts.forEach((v) =>
    count(v, "controlRevertantCounts"),
  );
  positive(input.minimumFoldIncrease, "minimumFoldIncrease");
  fraction(input.treatedViabilityFraction, "treatedViabilityFraction");
  fraction(input.minimumValidViability, "minimumValidViability");
  const meanTreatedRevertants = mean(input.treatedRevertantCounts),
    meanControlRevertants = mean(input.controlRevertantCounts);
  positive(meanControlRevertants, "controlRevertantCounts");
  const backgroundFoldIncrease = meanTreatedRevertants / meanControlRevertants,
    assayViabilityAdequate =
      input.treatedViabilityFraction >= input.minimumValidViability;
  return {
    meanTreatedRevertants,
    meanControlRevertants,
    backgroundFoldIncrease,
    assayViabilityAdequate,
    screenFlag:
      assayViabilityAdequate &&
      backgroundFoldIncrease >= input.minimumFoldIncrease,
  };
};
export const exampleInput = {
  treatedRevertantCounts: [30, 40],
  controlRevertantCounts: [10, 10],
  minimumFoldIncrease: 2,
  treatedViabilityFraction: 0.9,
  minimumValidViability: 0.8,
} satisfies Input;
export const exampleOutput = {
  meanTreatedRevertants: 35,
  meanControlRevertants: 10,
  backgroundFoldIncrease: 3.5,
  assayViabilityAdequate: true,
  screenFlag: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/ames-revertant-background-screen",
  title: "Ames Revertant Background Screen",
  description:
    "Screen replicate Ames revertant counts against background with an explicit viability criterion; not a definitive mutagenicity determination.",
  inputs: [
    {
      id: "treatedRevertantCounts",
      label: "Treated revertant counts",
      kind: "numberList",
    },
    {
      id: "controlRevertantCounts",
      label: "Control revertant counts",
      kind: "numberList",
    },
    {
      id: "minimumFoldIncrease",
      label: "Minimum fold increase",
      kind: "number",
    },
    {
      id: "treatedViabilityFraction",
      label: "Treated viability fraction",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
    {
      id: "minimumValidViability",
      label: "Minimum valid viability",
      kind: "number",
      minimum: 0,
      maximum: 1,
    },
  ],
  outputs: [
    {
      id: "meanTreatedRevertants",
      label: "Mean treated revertants",
      kind: "number",
    },
    {
      id: "meanControlRevertants",
      label: "Mean control revertants",
      kind: "number",
    },
    {
      id: "backgroundFoldIncrease",
      label: "Background fold increase",
      kind: "number",
    },
    {
      id: "assayViabilityAdequate",
      label: "Assay viability adequate",
      kind: "boolean",
    },
    { id: "screenFlag", label: "Screen flag", kind: "boolean" },
  ],
  calculate: (value) =>
    calculate({
      treatedRevertantCounts: value.treatedRevertantCounts as readonly number[],
      controlRevertantCounts: value.controlRevertantCounts as readonly number[],
      minimumFoldIncrease: value.minimumFoldIncrease as number,
      treatedViabilityFraction: value.treatedViabilityFraction as number,
      minimumValidViability: value.minimumValidViability as number,
    }),
});
export const run = tool.execute;
export default tool;
