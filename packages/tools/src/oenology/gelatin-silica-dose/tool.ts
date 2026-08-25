import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import { roundStatistic } from "../../statistics/input.js";

export type GelatinSilicaDoseInput = {
  readonly gelatinRateGPerHectoliter: number;
  readonly silicaMlPerGramGelatin: number;
  readonly volumeHectoliters: number;
};

export type GelatinSilicaDoseOutput = {
  readonly gelatinGrams: number;
  readonly silicaGelMl: number;
};

export const gelatinSilicaDoseExample = {
  input: {
    gelatinRateGPerHectoliter: 3,
    silicaMlPerGramGelatin: 10,
    volumeHectoliters: 20,
  },
  output: {
    gelatinGrams: 60,
    silicaGelMl: 600,
  },
} satisfies ToolExample<GelatinSilicaDoseInput, GelatinSilicaDoseOutput>;

export const calculateGelatinSilicaDose = (
  input: GelatinSilicaDoseInput,
): GelatinSilicaDoseOutput => {
  if (input.gelatinRateGPerHectoliter < 0)
    simpleError(
      "gelatinRateGPerHectoliter",
      "The gelatin rate cannot be negative.",
      "invalid_value",
    );
  const gelatinGrams = roundStatistic(
    input.gelatinRateGPerHectoliter * input.volumeHectoliters,
  );
  return {
    gelatinGrams: gelatinGrams,
    silicaGelMl: roundStatistic(gelatinGrams * input.silicaMlPerGramGelatin),
  };
};

export const gelatinSilicaDoseTool = createSimpleTool({
  calculate: (input) =>
    calculateGelatinSilicaDose(input as unknown as GelatinSilicaDoseInput),
  description:
    "Convert caller-selected gelatin and silica-gel pairing rates into total product quantities for a wine lot; product concentration and treatment rates must come from trials or supplier instructions.",
  id: "oenology/gelatin-silica-dose",
  inputs: [
    {
      description: "Gelatin per hectoliter of wine.",
      id: "gelatinRateGPerHectoliter",
      kind: "number",
      label: "Gelatin rate",
      minimum: 0,
      unit: "g/hL",
    },
    {
      description:
        "Milliliters of the selected silica product per gram of gelatin.",
      id: "silicaMlPerGramGelatin",
      kind: "number",
      label: "Silica pairing",
      minimum: 0,
      unit: "mL/g",
    },
    {
      description: "Wine volume to treat.",
      id: "volumeHectoliters",
      kind: "number",
      label: "Volume",
      minimum: 0,
      unit: "hL",
    },
  ],
  outputs: [
    {
      description: "Gelatin dissolved warm before the silica addition.",
      id: "gelatinGrams",
      kind: "number",
      label: "Gelatin",
      unit: "g",
    },
    {
      description: "Silica gel dispersion added after the gelatin.",
      id: "silicaGelMl",
      kind: "number",
      label: "Silica gel",
      unit: "mL",
    },
  ],
  title: "Gelatin-Silica Gel Pairing Dose Calculator",
});
export const runGelatinSilicaDose = gelatinSilicaDoseTool.execute;
export default gelatinSilicaDoseTool;
