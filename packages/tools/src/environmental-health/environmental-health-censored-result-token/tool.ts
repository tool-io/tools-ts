import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly resultId: string;
  readonly comparison: string;
  readonly boundaryValue: number;
  readonly unitText: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resultId: { type: "string", maxLength: 8192, minLength: 1 },
    comparison: {
      type: "string",
      maxLength: 8192,
      enum: ["<", "<=", ">", ">="],
    },
    boundaryValue: { type: "number" },
    unitText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["resultId", "comparison", "boundaryValue", "unitText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Format an explicit censored environmental result without imputing a concentration or setting a safety limit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { resultId, comparison, boundaryValue, unitText } = request;
  const compute = (): Output => {
    H.domain(resultId.length > 0 && unitText.length > 0, "resultId");
    H.domain(["<", "<=", ">", ">="].includes(comparison), "comparison");
    return {
      label: resultId + ": " + comparison + boundaryValue + " " + unitText,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    resultId: "R17",
    comparison: "<",
    boundaryValue: 0.5,
    unitText: "ug/L",
  },
  output: { label: "R17: <0.5 ug/L" },
} satisfies ToolExample<Input, Output>;
export const environmentalHealthCensoredResultTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data"],
        fields: [
          "environmental-health",
          "environmental health",
          "health and medicine",
        ],
        keywords: ["environmental health", "health and medicine"],
      },
      id: "environmental-health/environmental-health-censored-result-token",
      title: "Environmental Health Censored Result Token",
      description:
        "Format an explicit censored environmental result without imputing a concentration or setting a safety limit.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          resultId: { type: "string", maxLength: 8192, minLength: 1 },
          comparison: {
            type: "string",
            maxLength: 8192,
            enum: ["<", "<=", ">", ">="],
          },
          boundaryValue: { type: "number" },
          unitText: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["resultId", "comparison", "boundaryValue", "unitText"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { label: { type: "string", maxLength: 8192 } },
        required: ["label"],
      },
      ports: {
        inputs: [
          {
            id: "resultId",
            label: "Result Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "comparison",
            label: "Comparison",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "boundaryValue",
            label: "Boundary Value",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "unitText",
            label: "Unit Text",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "label", label: "Label", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = environmentalHealthCensoredResultTokenTool.execute;
export default environmentalHealthCensoredResultTokenTool;
