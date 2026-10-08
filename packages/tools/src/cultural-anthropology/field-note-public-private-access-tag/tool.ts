import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly noteCode: string; readonly access: string };
export type Output = { readonly tag: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    noteCode: { type: "string", maxLength: 8192, minLength: 1 },
    access: {
      type: "string",
      maxLength: 8192,
      enum: ["public", "private", "restricted", "undetermined"],
    },
  },
  required: ["noteCode", "access"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { tag: { type: "string", maxLength: 8192 } },
  required: ["tag"],
} as const;
/** Render an explicitly recorded field-note access category without disclosing notes or authorizing access. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { noteCode, access } = request;
  const compute = (): Output => {
    H.domain(noteCode.length > 0, "noteCode");
    H.domain(
      ["public", "private", "restricted", "undetermined"].includes(access),
      "access",
    );
    return { tag: noteCode + " [access: " + access + "]" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { noteCode: "N17", access: "restricted" },
  output: { tag: "N17 [access: restricted]" },
} satisfies ToolExample<Input, Output>;
export const fieldNotePublicPrivateAccessTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "cultural-anthropology",
        "cultural anthropology",
        "social sciences",
      ],
      keywords: ["cultural anthropology", "social sciences"],
    },
    id: "cultural-anthropology/field-note-public-private-access-tag",
    title: "Field Note Public Private Access Tag",
    description:
      "Render an explicitly recorded field-note access category without disclosing notes or authorizing access.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        noteCode: { type: "string", maxLength: 8192, minLength: 1 },
        access: {
          type: "string",
          maxLength: 8192,
          enum: ["public", "private", "restricted", "undetermined"],
        },
      },
      required: ["noteCode", "access"],
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
          id: "noteCode",
          label: "Note Code",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "access",
          label: "Access",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "tag", label: "Tag", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = fieldNotePublicPrivateAccessTagTool.execute;
export default fieldNotePublicPrivateAccessTagTool;
