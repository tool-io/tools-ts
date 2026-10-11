import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly suppliedName: string;
  readonly maskText: string;
  readonly displayPermissionRecorded: boolean;
};
export type Output = { readonly displayText: string; readonly masked: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedName: { type: "string", maxLength: 8192 },
    maskText: { type: "string", maxLength: 8192, minLength: 1 },
    displayPermissionRecorded: { type: "boolean" },
  },
  required: ["suppliedName", "maskText", "displayPermissionRecorded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    displayText: { type: "string", maxLength: 8192 },
    masked: { type: "boolean" },
  },
  required: ["displayText", "masked"],
} as const;
/** Select an explicit name or mask under a supplied display-permission flag without guaranteeing case-note anonymization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedName, maskText, displayPermissionRecorded } = request;
  const compute = (): Output => {
    H.domain(maskText.length > 0, "maskText");
    return {
      displayText: displayPermissionRecorded ? suppliedName : maskText,
      masked: !displayPermissionRecorded,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    suppliedName: "Name A",
    maskText: "[name withheld]",
    displayPermissionRecorded: false,
  },
  output: { displayText: "[name withheld]", masked: true },
} satisfies ToolExample<Input, Output>;
export const consentedCaseNoteNameMaskTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["social-work", "social work", "social sciences"],
      keywords: ["social work", "social sciences"],
    },
    id: "social-work/consented-case-note-name-mask",
    title: "Consented Case Note Name Mask",
    description:
      "Select an explicit name or mask under a supplied display-permission flag without guaranteeing case-note anonymization.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suppliedName: { type: "string", maxLength: 8192 },
        maskText: { type: "string", maxLength: 8192, minLength: 1 },
        displayPermissionRecorded: { type: "boolean" },
      },
      required: ["suppliedName", "maskText", "displayPermissionRecorded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        displayText: { type: "string", maxLength: 8192 },
        masked: { type: "boolean" },
      },
      required: ["displayText", "masked"],
    },
    ports: {
      inputs: [
        {
          id: "suppliedName",
          label: "Supplied Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "maskText",
          label: "Mask Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "displayPermissionRecorded",
          label: "Display Permission Recorded",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "displayText",
          label: "Display Text",
          valueType: { type: "string" },
        },
        { id: "masked", label: "Masked", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = consentedCaseNoteNameMaskTool.execute;
export default consentedCaseNoteNameMaskTool;
