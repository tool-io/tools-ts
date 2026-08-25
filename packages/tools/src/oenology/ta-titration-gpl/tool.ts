import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type TaTitrationGplInput = {
  readonly naohMl: number;
  readonly naohNormality?: number;
  readonly sampleMl: number;
};

export type TaTitrationGplOutput = {
  readonly taGPerL: number;
};

export const taTitrationGplExample = {
  input: {
    naohMl: 8.8,
    naohNormality: 0.1,
    sampleMl: 10,
  },
  output: {
    taGPerL: 6.6,
  },
} satisfies ToolExample<TaTitrationGplInput, TaTitrationGplOutput>;

export const calculateTaTitrationGpl = (
  input: TaTitrationGplInput,
): TaTitrationGplOutput => {
  if (input.sampleMl <= 0)
    simpleError(
      "sampleMl",
      "The sample volume must be positive.",
      "invalid_value",
    );
  const normality = input.naohNormality ?? 0.1;
  if (normality <= 0)
    simpleError(
      "naohNormality",
      "The titrant normality must be positive.",
      "invalid_value",
    );
  return {
    taGPerL: roundStatistic((input.naohMl * normality * 75) / input.sampleMl),
  };
};

export const taTitrationGplTool = createSimpleTool({
  calculate: (input) =>
    calculateTaTitrationGpl(input as unknown as TaTitrationGplInput),
  description:
    "Convert a sodium hydroxide titration volume to titratable acidity in grams per liter expressed as tartaric acid.",
  id: "oenology/ta-titration-gpl",
  inputs: [
    {
      description: "Milliliters of NaOH to the phenolphthalein endpoint.",
      id: "naohMl",
      kind: "number",
      label: "NaOH volume",
      minimum: 0,
      unit: "mL",
    },
    {
      default: 0.1,
      description: "Normality of the NaOH titrant.",
      id: "naohNormality",
      kind: "number",
      label: "NaOH normality",
      minimum: 0,
    },
    {
      description: "Milliliters of wine or must sampled.",
      id: "sampleMl",
      kind: "number",
      label: "Sample volume",
      minimum: 0,
      unit: "mL",
    },
  ],
  outputs: [
    {
      description: "Titratable acidity expressed as tartaric acid.",
      id: "taGPerL",
      kind: "number",
      label: "TA",
      unit: "g/L",
    },
  ],
  title: "TA Titration Volume to g/L Calculator",
});
export const runTaTitrationGpl = taTitrationGplTool.execute;
export default taTitrationGplTool;
