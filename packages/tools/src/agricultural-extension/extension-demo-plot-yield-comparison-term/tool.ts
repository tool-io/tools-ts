import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstHarvest: number;
  readonly firstArea: number;
  readonly secondHarvest: number;
  readonly secondArea: number;
};
export type Output = {
  readonly firstYield: number;
  readonly secondYield: number;
  readonly gap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstHarvest: { type: "number", minimum: 0 },
    firstArea: { type: "number", exclusiveMinimum: 0 },
    secondHarvest: { type: "number", minimum: 0 },
    secondArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firstHarvest", "firstArea", "secondHarvest", "secondArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstYield: { type: "number" },
    secondYield: { type: "number" },
    gap: { type: "number" },
  },
  required: ["firstYield", "secondYield", "gap"],
} as const;
/** Calculate extension demo plot yield comparison term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstHarvest, firstArea, secondHarvest, secondArea } = request;
  const compute = (): Output => {
    H.positive(firstArea);
    H.positive(secondArea);
    H.domain(firstHarvest >= 0 && secondHarvest >= 0);
    return {
      firstYield: firstHarvest / firstArea,
      secondYield: secondHarvest / secondArea,
      gap: secondHarvest / secondArea - firstHarvest / firstArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstHarvest: 20, firstArea: 10, secondHarvest: 30, secondArea: 10 },
  output: { firstYield: 2, secondYield: 3, gap: 1 },
} satisfies ToolExample<Input, Output>;
export const extensionDemoPlotYieldComparisonTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agricultural-extension/extension-demo-plot-yield-comparison-term",
      title: "Extension Demo Plot Yield Comparison Term Tool",
      description:
        "Calculate extension demo plot yield comparison term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstHarvest: { type: "number", minimum: 0 },
          firstArea: { type: "number", exclusiveMinimum: 0 },
          secondHarvest: { type: "number", minimum: 0 },
          secondArea: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["firstHarvest", "firstArea", "secondHarvest", "secondArea"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstYield: { type: "number" },
          secondYield: { type: "number" },
          gap: { type: "number" },
        },
        required: ["firstYield", "secondYield", "gap"],
      },
      ports: {
        inputs: [
          {
            id: "firstHarvest",
            label: "First Harvest",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "firstArea",
            label: "First Area",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondHarvest",
            label: "Second Harvest",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondArea",
            label: "Second Area",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "firstYield",
            label: "First Yield",
            valueType: { type: "number" },
          },
          {
            id: "secondYield",
            label: "Second Yield",
            valueType: { type: "number" },
          },
          { id: "gap", label: "Gap", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = extensionDemoPlotYieldComparisonTermTool.execute;
export default extensionDemoPlotYieldComparisonTermTool;
