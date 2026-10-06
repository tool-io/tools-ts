import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly studentWorkTitle: string;
  readonly permission: boolean;
  readonly replacementTitle: string;
};
export type Output = { readonly publishedTitle: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    studentWorkTitle: { type: "string", maxLength: 8192 },
    permission: { type: "boolean" },
    replacementTitle: { type: "string", maxLength: 8192 },
  },
  required: ["studentWorkTitle", "permission", "replacementTitle"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { publishedTitle: { type: "string", maxLength: 8192 } },
  required: ["publishedTitle"],
} as const;
/** Choose supplied student-work title or supplied replacement under an explicit publication permission flag. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { studentWorkTitle, permission, replacementTitle } = request;
  const compute = (): Output => {
    return { publishedTitle: permission ? studentWorkTitle : replacementTitle };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    studentWorkTitle: "Garden",
    permission: true,
    replacementTitle: "Untitled",
  },
  output: { publishedTitle: "Garden" },
} satisfies ToolExample<Input, Output>;
export const artStudentConsentedWorkTitleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["art-education", "art education", "education"],
      keywords: ["art education", "education"],
    },
    id: "art-education/art-student-consented-work-title",
    title: "Art Student Consented Work Title",
    description:
      "Choose supplied student-work title or supplied replacement under an explicit publication permission flag.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        studentWorkTitle: { type: "string", maxLength: 8192 },
        permission: { type: "boolean" },
        replacementTitle: { type: "string", maxLength: 8192 },
      },
      required: ["studentWorkTitle", "permission", "replacementTitle"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { publishedTitle: { type: "string", maxLength: 8192 } },
      required: ["publishedTitle"],
    },
    ports: {
      inputs: [
        {
          id: "studentWorkTitle",
          label: "Student Work Title",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "permission",
          label: "Permission",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "replacementTitle",
          label: "Replacement Title",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "publishedTitle",
          label: "Published Title",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = artStudentConsentedWorkTitleTool.execute;
export default artStudentConsentedWorkTitleTool;
