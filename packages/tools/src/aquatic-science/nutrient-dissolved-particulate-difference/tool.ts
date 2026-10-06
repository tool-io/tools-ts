import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalConcentration: number;
  readonly dissolvedConcentration: number;
};
export type Output = { readonly particulateByDifference: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalConcentration: { type: "number" },
    dissolvedConcentration: { type: "number" },
  },
  required: ["totalConcentration", "dissolvedConcentration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { particulateByDifference: { type: "number" } },
  required: ["particulateByDifference"],
} as const;
/** Subtract a matched dissolved nutrient concentration from total concentration, retaining negative differences for analytical review. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalConcentration, dissolvedConcentration } = request;
  const compute = (): Output => {
    return {
      particulateByDifference: totalConcentration - dissolvedConcentration,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalConcentration: 1.2, dissolvedConcentration: 0.8 },
  output: { particulateByDifference: 0.3999999999999999 },
} satisfies ToolExample<Input, Output>;
export const nutrientDissolvedParticulateDifferenceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: [
          "aquatic-science",
          "aquatic science",
          "earth and environmental sciences",
        ],
        keywords: ["aquatic science", "earth and environmental sciences"],
      },
      id: "aquatic-science/nutrient-dissolved-particulate-difference",
      title: "Nutrient Dissolved Particulate Difference",
      description:
        "Subtract a matched dissolved nutrient concentration from total concentration, retaining negative differences for analytical review.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          totalConcentration: { type: "number" },
          dissolvedConcentration: { type: "number" },
        },
        required: ["totalConcentration", "dissolvedConcentration"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { particulateByDifference: { type: "number" } },
        required: ["particulateByDifference"],
      },
      ports: {
        inputs: [
          {
            id: "totalConcentration",
            label: "Total Concentration",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "dissolvedConcentration",
            label: "Dissolved Concentration",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "particulateByDifference",
            label: "Particulate By Difference",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = nutrientDissolvedParticulateDifferenceTool.execute;
export default nutrientDissolvedParticulateDifferenceTool;
