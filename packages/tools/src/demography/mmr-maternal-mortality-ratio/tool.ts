import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type MmrMaternalMortalityRatioInput = {
  readonly maternalDeaths: number;
  readonly liveBirths: number;
};

export type MmrMaternalMortalityRatioOutput = {
  readonly maternalMortalityRatio: number;
};

export const calculateMmrMaternalMortalityRatio = (
  input: MmrMaternalMortalityRatioInput,
): MmrMaternalMortalityRatioOutput => {
  if (!(input.maternalDeaths >= 0))
    simpleError(
      "maternalDeaths",
      "Maternal deaths must be non-negative.",
      "invalid_deaths",
    );
  if (!(input.liveBirths > 0))
    simpleError(
      "liveBirths",
      "Live births must be greater than zero.",
      "invalid_births",
    );
  return {
    maternalMortalityRatio: (input.maternalDeaths / input.liveBirths) * 100000,
  };
};

export const mmrMaternalMortalityRatioExample = {
  input: { maternalDeaths: 420, liveBirths: 180000 },
  output: { maternalMortalityRatio: 233.33333333333334 },
} satisfies ToolExample<
  MmrMaternalMortalityRatioInput,
  MmrMaternalMortalityRatioOutput
>;

export const mmrMaternalMortalityRatioTool = createSimpleTool({
  id: "demography/mmr-maternal-mortality-ratio",
  title: "MMR Maternal Mortality Ratio Calculator",
  description:
    "Compute the maternal mortality ratio as deaths attributed to pregnancy and childbirth per one hundred thousand live births.",
  inputs: [
    {
      description:
        "Maternal deaths during pregnancy or within the postpartum window.",
      id: "maternalDeaths",
      kind: "number",
      label: "Maternal deaths",
      minimum: 0,
    },
    {
      description: "Live births in the same period.",
      id: "liveBirths",
      kind: "number",
      label: "Live births",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Maternal mortality ratio per 100000 live births.",
      id: "maternalMortalityRatio",
      kind: "number",
      label: "MMR",
    },
  ],
  calculate: (input) =>
    calculateMmrMaternalMortalityRatio(
      input as unknown as MmrMaternalMortalityRatioInput,
    ),
});

export const runMmrMaternalMortalityRatio =
  mmrMaternalMortalityRatioTool.execute;
export default mmrMaternalMortalityRatioTool;
