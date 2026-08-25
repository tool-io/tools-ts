import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ServingTempLookupInput = {
  readonly wineStyle: string;
};

export type ServingTempLookupOutput = {
  readonly servingTemperatureC: number;
};

export const servingTempLookupExample = {
  input: {
    wineStyle: "full_red",
  },
  output: {
    servingTemperatureC: 17,
  },
} satisfies ToolExample<ServingTempLookupInput, ServingTempLookupOutput>;

const SERVING_TEMP_C_BY_STYLE: Record<string, number> = {
  full_red: 17,
  light_red: 14,
  rose: 10,
  sparkling: 6,
  full_white: 11,
  light_white: 9,
};

export const calculateServingTemp = (
  input: ServingTempLookupInput,
): ServingTempLookupOutput => {
  const temperature = SERVING_TEMP_C_BY_STYLE[input.wineStyle];
  if (temperature === undefined)
    simpleError(
      "wineStyle",
      "Choose one of sparkling, light_white, full_white, rose, light_red, or full_red.",
      "invalid_value",
    );
  return { servingTemperatureC: temperature };
};

export const servingTempLookupTool = createSimpleTool({
  calculate: (input) =>
    calculateServingTemp(input as unknown as ServingTempLookupInput),
  description:
    "Look up the cellar-guide serving temperature midpoint for a wine style.",
  id: "oenology/serving-temp-lookup",
  inputs: [
    {
      description:
        "One of sparkling, light_white, full_white, rose, light_red, or full_red.",
      id: "wineStyle",
      kind: "string",
      label: "Wine style",
    },
  ],
  outputs: [
    {
      description: "Suggested serving temperature at the middle of the band.",
      id: "servingTemperatureC",
      kind: "number",
      label: "Serving temperature",
      unit: "°C",
    },
  ],
  title: "Serving Temperature Guide Lookup",
});
export const runServingTempLookup = servingTempLookupTool.execute;
export default servingTempLookupTool;
