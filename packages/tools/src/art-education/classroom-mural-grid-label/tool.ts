import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rowOneBased: number;
  readonly columnOneBased: number;
};
export type Output = { readonly label: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rowOneBased: { type: "integer", minimum: 1 },
    columnOneBased: { type: "integer", minimum: 1 },
  },
  required: ["rowOneBased", "columnOneBased"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { label: { type: "string", maxLength: 8192 } },
  required: ["label"],
} as const;
/** Label one explicitly supplied one-based classroom mural grid row and column. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rowOneBased, columnOneBased } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(rowOneBased) &&
        rowOneBased >= 1 &&
        rowOneBased <= Number.MAX_SAFE_INTEGER,
      "rowOneBased",
    ),
      rowOneBased);
    (H.domain(
      Number.isSafeInteger(columnOneBased) &&
        columnOneBased >= 1 &&
        columnOneBased <= Number.MAX_SAFE_INTEGER,
      "columnOneBased",
    ),
      columnOneBased);
    return { label: "R" + rowOneBased + "C" + columnOneBased };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rowOneBased: 2, columnOneBased: 4 },
  output: { label: "R2C4" },
} satisfies ToolExample<Input, Output>;
export const classroomMuralGridLabelTool = H.defineSchemaCalculation<
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
    id: "art-education/classroom-mural-grid-label",
    title: "Classroom Mural Grid Label",
    description:
      "Label one explicitly supplied one-based classroom mural grid row and column.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rowOneBased: { type: "integer", minimum: 1 },
        columnOneBased: { type: "integer", minimum: 1 },
      },
      required: ["rowOneBased", "columnOneBased"],
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
          id: "rowOneBased",
          label: "Row One Based",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "columnOneBased",
          label: "Column One Based",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "label", label: "Label", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = classroomMuralGridLabelTool.execute;
export default classroomMuralGridLabelTool;
