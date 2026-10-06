import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly workId: string;
  readonly editionId: string;
  readonly copyLabel: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    workId: { type: "string", maxLength: 8192, minLength: 1 },
    editionId: { type: "string", maxLength: 8192, minLength: 1 },
    copyLabel: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["workId", "editionId", "copyLabel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicit classroom print copy label within a supplied work edition. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { workId, editionId, copyLabel } = request;
  const compute = (): Output => {
    H.domain(workId.length > 0, "workId");
    H.domain(editionId.length > 0, "editionId");
    H.domain(copyLabel.length > 0, "copyLabel");
    return { token: JSON.stringify([workId, editionId, copyLabel]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { workId: "W17", editionId: "E4", copyLabel: "3/20" },
  output: { token: '["W17","E4","3/20"]' },
} satisfies ToolExample<Input, Output>;
export const classroomPrintCopyEditionLabelTool = H.defineSchemaCalculation<
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
    id: "art-education/classroom-print-copy-edition-label",
    title: "Classroom Print Copy Edition Label",
    description:
      "Preserve an explicit classroom print copy label within a supplied work edition.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        workId: { type: "string", maxLength: 8192, minLength: 1 },
        editionId: { type: "string", maxLength: 8192, minLength: 1 },
        copyLabel: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["workId", "editionId", "copyLabel"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "workId",
          label: "Work Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "editionId",
          label: "Edition Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "copyLabel",
          label: "Copy Label",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = classroomPrintCopyEditionLabelTool.execute;
export default classroomPrintCopyEditionLabelTool;
