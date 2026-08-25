import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type ChlorophyllContentSpadInput = {
  readonly conversionFactor?: number;
  readonly spadValue: number;
};

export type ChlorophyllContentSpadOutput = {
  readonly chlorophyllEstimateUGPerCm2: number;
};

export const chlorophyllContentSpadExample = {
  input: { spadValue: 40 },
  output: { chlorophyllEstimateUGPerCm2: 16 },
} satisfies ToolExample<
  ChlorophyllContentSpadInput,
  ChlorophyllContentSpadOutput
>;

export const chlorophyllContentSpadTool = createSimpleTool({
  id: "biology/chlorophyll-content-spad",
  title: "SPAD To Chlorophyll",
  description:
    "Estimate chlorophyll content from a SPAD reading with the documented linear approximation chlorophyll = SPAD value times conversion factor, where the factor defaults to 0.4.",
  inputs: [
    {
      default: 0.4,
      description:
        "Documented linear approximation factor mapping SPAD units to micrograms per square centimeter; defaults to 0.4 and must lie between 0 and 2.",
      id: "conversionFactor",
      kind: "number",
      label: "Conversion factor",
      maximum: 2,
      minimum: 0,
    },
    {
      description: "SPAD meter reading; must not be negative.",
      id: "spadValue",
      kind: "number",
      label: "SPAD value",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description:
        "Estimated chlorophyll content in micrograms per square centimeter.",
      id: "chlorophyllEstimateUGPerCm2",
      kind: "number",
      label: "Chlorophyll estimate",
      unit: "ug/cm^2",
    },
  ],
  calculate: (input) => ({
    chlorophyllEstimateUGPerCm2:
      (input.spadValue as number) * (input.conversionFactor as number),
  }),
});
export const runChlorophyllContentSpad = chlorophyllContentSpadTool.execute;
export default chlorophyllContentSpadTool;
