import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ChlorophyllABRatioInput = {
  readonly chlorophyllAUgmL: number;
  readonly chlorophyllBUgmL: number;
};

export type ChlorophyllABRatioOutput = {
  readonly chlorophyllABRatio: number;
};

export const chlorophyllAbRatioExample = {
  input: { chlorophyllAUgmL: 2.4, chlorophyllBUgmL: 1.2 },
  output: { chlorophyllABRatio: 2 },
} satisfies ToolExample<ChlorophyllABRatioInput, ChlorophyllABRatioOutput>;

export const chlorophyllAbRatioTool = createSimpleTool({
  id: "biology/chlorophyll-a-b-ratio",
  title: "Chl a/b Ratio",
  description:
    "Compute the chlorophyll a to chlorophyll b ratio from pigment concentrations in micrograms per milliliter.",
  inputs: [
    {
      description:
        "Chlorophyll a concentration in micrograms per milliliter; must not be negative.",
      id: "chlorophyllAUgmL",
      kind: "number",
      label: "Chlorophyll a",
      minimum: 0,
      unit: "ug/mL",
    },
    {
      description:
        "Chlorophyll b concentration in micrograms per milliliter; must be greater than zero.",
      id: "chlorophyllBUgmL",
      kind: "number",
      label: "Chlorophyll b",
      unit: "ug/mL",
    },
  ],
  outputs: [
    {
      description: "Chlorophyll a divided by chlorophyll b.",
      id: "chlorophyllABRatio",
      kind: "number",
      label: "Chl a/b ratio",
    },
  ],
  calculate: (input) => {
    const chlorophyllAUgmL = input.chlorophyllAUgmL as number;
    const chlorophyllBUgmL = input.chlorophyllBUgmL as number;
    if (!(chlorophyllBUgmL > 0))
      simpleError(
        "chlorophyllBUgmL",
        "The chlorophyll b concentration must be greater than zero.",
      );
    return { chlorophyllABRatio: chlorophyllAUgmL / chlorophyllBUgmL };
  },
});
export const runChlorophyllAbRatio = chlorophyllAbRatioTool.execute;
export default chlorophyllAbRatioTool;
