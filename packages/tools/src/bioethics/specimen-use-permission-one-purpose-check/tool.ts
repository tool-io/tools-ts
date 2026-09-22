import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grantedPurposes: readonly string[];
  readonly requestedPurpose: string;
  readonly withdrawn: boolean;
};
export type Output = {
  readonly listed: boolean;
  readonly allowedByInputs: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grantedPurposes: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    requestedPurpose: { type: "string", maxLength: 8192 },
    withdrawn: { type: "boolean" },
  },
  required: ["grantedPurposes", "requestedPurpose", "withdrawn"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    listed: { type: "boolean" },
    allowedByInputs: { type: "boolean" },
  },
  required: ["listed", "allowedByInputs"],
} as const;
/** Combine explicit purpose membership with a withdrawal flag, without inferring clinical or legal authorization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grantedPurposes, requestedPurpose, withdrawn } = request;
  const compute = (): Output => {
    const listed = grantedPurposes.includes(requestedPurpose);
    return { listed, allowedByInputs: listed && !withdrawn };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    grantedPurposes: ["A", "B"],
    requestedPurpose: "B",
    withdrawn: false,
  },
  output: { listed: true, allowedByInputs: true },
} satisfies ToolExample<Input, Output>;
export const specimenUsePermissionOnePurposeCheckTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "bioethics/specimen-use-permission-one-purpose-check",
      title: "Specimen Use Permission One Purpose Check Tool",
      description:
        "Combine explicit purpose membership with a withdrawal flag, without inferring clinical or legal authorization.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          grantedPurposes: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
          requestedPurpose: { type: "string", maxLength: 8192 },
          withdrawn: { type: "boolean" },
        },
        required: ["grantedPurposes", "requestedPurpose", "withdrawn"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          listed: { type: "boolean" },
          allowedByInputs: { type: "boolean" },
        },
        required: ["listed", "allowedByInputs"],
      },
      ports: {
        inputs: [
          {
            id: "grantedPurposes",
            label: "Granted Purposes",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
          {
            id: "requestedPurpose",
            label: "Requested Purpose",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "withdrawn",
            label: "Withdrawn",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "listed", label: "Listed", valueType: { type: "boolean" } },
          {
            id: "allowedByInputs",
            label: "Allowed By Inputs",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = specimenUsePermissionOnePurposeCheckTool.execute;
export default specimenUsePermissionOnePurposeCheckTool;
