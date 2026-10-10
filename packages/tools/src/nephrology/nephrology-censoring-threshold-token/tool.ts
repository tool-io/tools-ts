import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly resultId: string;
  readonly boundaryValue: number;
  readonly comparison: string;
  readonly unitText: string;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    resultId: { type: "string", maxLength: 8192, minLength: 1 },
    boundaryValue: { type: "number" },
    comparison: {
      type: "string",
      maxLength: 8192,
      enum: ["<", "<=", ">", ">="],
    },
    unitText: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["resultId", "boundaryValue", "comparison", "unitText"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Format a supplied renal-result censoring bound without imputing a value or selecting a threshold. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { resultId, boundaryValue, comparison, unitText } = request;
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
    boundaryValue: 5,
    comparison: "<",
    unitText: "unit A",
  },
  output: { label: "R17: <5 unit A" },
} satisfies ToolExample<Input, Output>;
export const nephrologyCensoringThresholdTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["nephrology", "health and medicine"],
      keywords: ["nephrology", "health and medicine"],
    },
    id: "nephrology/nephrology-censoring-threshold-token",
    title: "Nephrology Censoring Threshold Token",
    description:
      "Format a supplied renal-result censoring bound without imputing a value or selecting a threshold.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        resultId: { type: "string", maxLength: 8192, minLength: 1 },
        boundaryValue: { type: "number" },
        comparison: {
          type: "string",
          maxLength: 8192,
          enum: ["<", "<=", ">", ">="],
        },
        unitText: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["resultId", "boundaryValue", "comparison", "unitText"],
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
export const run = nephrologyCensoringThresholdTokenTool.execute;
export default nephrologyCensoringThresholdTokenTool;
