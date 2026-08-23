import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SeriesResistanceInput = {
  readonly resistancesOhms: readonly number[];
};

export type SeriesResistanceOutput = {
  readonly totalResistanceOhms: number;
};

export const calculateSeriesResistance = (
  input: SeriesResistanceInput,
): SeriesResistanceOutput => {
  for (const resistance of input.resistancesOhms)
    if (!(resistance > 0))
      return simpleError(
        "resistancesOhms",
        "Every resistance must be positive.",
        "invalid_resistance",
      );
  if (input.resistancesOhms.length === 0)
    return simpleError(
      "resistancesOhms",
      "Provide at least one resistance.",
      "insufficient_resistances",
    );
  return {
    totalResistanceOhms: input.resistancesOhms.reduce(
      (sum, value) => sum + value,
      0,
    ),
  };
};

export const seriesResistanceExample = {
  input: {
    resistancesOhms: [10, 220, 1000],
  },
  output: {
    totalResistanceOhms: 1230,
  },
} satisfies ToolExample<SeriesResistanceInput, SeriesResistanceOutput>;

export const seriesResistanceTool = createSimpleTool({
  id: "electricity/series-resistance",
  title: "Series Resistance Calculator",
  description: "Sum resistors wired in series: R_total = sum(R_i).",
  inputs: [
    {
      description: "Resistor values in ohms, each positive.",
      id: "resistancesOhms",
      kind: "numberList",
      label: "Resistances",
      unit: "ohm",
    },
  ],
  outputs: [
    {
      description: "Sum of all series resistances.",
      id: "totalResistanceOhms",
      kind: "number",
      label: "Total resistance",
      unit: "ohm",
    },
  ],
  calculate: (input) =>
    calculateSeriesResistance({
      resistancesOhms: input.resistancesOhms as readonly number[],
    }),
});

export const runSeriesResistance = seriesResistanceTool.execute;
export default seriesResistanceTool;
