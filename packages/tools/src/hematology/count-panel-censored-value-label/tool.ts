import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly resultCode: string;
  readonly boundaryValue: number;
  readonly comparison: string;
  readonly unitText: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resultCode: { type: "string", maxLength: 8192, minLength: 1 },
    boundaryValue: { type: "number" },
    comparison: {
      type: "string",
      maxLength: 8192,
      enum: ["<", "<=", ">", ">="],
    },
    unitText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["resultCode", "boundaryValue", "comparison", "unitText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Format an explicitly censored count result without replacing it with a point estimate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { resultCode, boundaryValue, comparison, unitText } = request;
  const compute = (): Output => {
    H.domain(resultCode.length > 0 && unitText.length > 0, "resultCode");
    H.domain(["<", "<=", ">", ">="].includes(comparison), "comparison");
    return {
      label: resultCode + ": " + comparison + boundaryValue + " " + unitText,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    resultCode: "R17",
    boundaryValue: 0.1,
    comparison: "<",
    unitText: "10^9/L",
  },
  output: { label: "R17: <0.1 10^9/L" },
} satisfies ToolExample<Input, Output>;
export const countPanelCensoredvalueLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["hematology", "health and medicine"],
      keywords: ["hematology", "health and medicine"],
    },
    id: "hematology/count-panel-censored-value-label",
    title: "Count Panel Censored Value Label",
    description:
      "Format an explicitly censored count result without replacing it with a point estimate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        resultCode: { type: "string", maxLength: 8192, minLength: 1 },
        boundaryValue: { type: "number" },
        comparison: {
          type: "string",
          maxLength: 8192,
          enum: ["<", "<=", ">", ">="],
        },
        unitText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["resultCode", "boundaryValue", "comparison", "unitText"],
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
          id: "resultCode",
          label: "Result Code",
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
          id: "comparison",
          label: "Comparison",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "unitText",
          label: "Unit Text",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = countPanelCensoredvalueLabelTool.execute;
export default countPanelCensoredvalueLabelTool;
