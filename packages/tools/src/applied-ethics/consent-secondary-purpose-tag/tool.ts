import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordCode: string;
  readonly purposeCode: string;
  readonly consentStatus: string;
};
export type Output = { readonly tag: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordCode: { type: "string", maxLength: 8192, minLength: 1 },
    purposeCode: { type: "string", maxLength: 8192, minLength: 1 },
    consentStatus: {
      type: "string",
      maxLength: 8192,
      enum: ["granted", "declined", "pending", "withdrawn"],
    },
  },
  required: ["recordCode", "purposeCode", "consentStatus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
/** Label an explicitly recorded secondary-purpose consent state without independently authorizing reuse. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordCode, purposeCode, consentStatus } = request;
  const compute = (): Output => {
    H.domain(recordCode.length > 0 && purposeCode.length > 0, "recordCode");
    H.domain(
      ["granted", "declined", "pending", "withdrawn"].includes(consentStatus),
      "consentStatus",
    );
    return { tag: JSON.stringify([recordCode, purposeCode, consentStatus]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recordCode: "R17",
    purposeCode: "secondary-study",
    consentStatus: "pending",
  },
  output: { tag: '["R17","secondary-study","pending"]' },
} satisfies ToolExample<Input, Output>;
export const consentSecondaryPurposeTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["applied-ethics", "applied ethics", "philosophy"],
      keywords: ["applied ethics", "philosophy"],
    },
    id: "applied-ethics/consent-secondary-purpose-tag",
    title: "Consent Secondary Purpose Tag",
    description:
      "Label an explicitly recorded secondary-purpose consent state without independently authorizing reuse.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordCode: { type: "string", maxLength: 8192, minLength: 1 },
        purposeCode: { type: "string", maxLength: 8192, minLength: 1 },
        consentStatus: {
          type: "string",
          maxLength: 8192,
          enum: ["granted", "declined", "pending", "withdrawn"],
        },
      },
      required: ["recordCode", "purposeCode", "consentStatus"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { tag: { type: "string", maxLength: 8192 } },
      required: ["tag"],
    },
    ports: {
      inputs: [
        {
          id: "recordCode",
          label: "Record Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "purposeCode",
          label: "Purpose Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "consentStatus",
          label: "Consent Status",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "tag", label: "Tag", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = consentSecondaryPurposeTagTool.execute;
export default consentSecondaryPurposeTagTool;
