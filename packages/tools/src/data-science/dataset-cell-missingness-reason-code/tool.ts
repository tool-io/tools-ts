import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observed: boolean;
  readonly reasonCode: string;
  readonly allowedMissingCodes: readonly string[];
};
export type Output = { readonly classification: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observed: { type: "boolean" },
    reasonCode: { type: "string", maxLength: 8192 },
    allowedMissingCodes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["observed", "reasonCode", "allowedMissingCodes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { classification: { type: "string", maxLength: 8192 } },
  required: ["classification"],
} as const;
/** Keep an explicitly observed data cell distinct from an allowed missingness reason; observed cells require an empty reason field. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observed, reasonCode, allowedMissingCodes } = request;
  const compute = (): Output => {
    H.domain(
      observed ? reasonCode === "" : allowedMissingCodes.includes(reasonCode),
      "reasonCode",
    );
    return { classification: observed ? "observed" : reasonCode };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    observed: false,
    reasonCode: "not-collected",
    allowedMissingCodes: ["not-collected", "refused"],
  },
  output: { classification: "not-collected" },
} satisfies ToolExample<Input, Output>;
export const datasetCellMissingnessReasonCodeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["data-science", "data science", "computer science"],
      keywords: ["data science", "computer science"],
    },
    id: "data-science/dataset-cell-missingness-reason-code",
    title: "Dataset Cell Missingness Reason Code",
    description:
      "Keep an explicitly observed data cell distinct from an allowed missingness reason; observed cells require an empty reason field.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observed: { type: "boolean" },
        reasonCode: { type: "string", maxLength: 8192 },
        allowedMissingCodes: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["observed", "reasonCode", "allowedMissingCodes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { classification: { type: "string", maxLength: 8192 } },
      required: ["classification"],
    },
    ports: {
      inputs: [
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "reasonCode",
          label: "Reason Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "allowedMissingCodes",
          label: "Allowed Missing Codes",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "classification",
          label: "Classification",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = datasetCellMissingnessReasonCodeTool.execute;
export default datasetCellMissingnessReasonCodeTool;
