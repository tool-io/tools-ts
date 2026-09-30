import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cursor: number;
  readonly pageSize: number;
  readonly shiftPages: number;
  readonly length: number;
};
export type Output = { readonly cursor: number; readonly clamped: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cursor: { type: "integer", minimum: 0 },
    pageSize: { type: "integer", minimum: 1 },
    shiftPages: { type: "integer" },
    length: { type: "integer", minimum: 0 },
  },
  required: ["cursor", "pageSize", "shiftPages", "length"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { cursor: { type: "integer" }, clamped: { type: "boolean" } },
  required: ["cursor", "clamped"],
} as const;
/** Calculate list page boundary cursor shift from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { cursor, pageSize, shiftPages, length } = input;
  const compute = (): Output => {
    H.integer(length, 0);
    H.integer(cursor, 0, length);
    H.integer(pageSize, 1);
    const raw = cursor + pageSize * shiftPages,
      value = Math.max(0, Math.min(length, raw));
    return { cursor: value, clamped: value !== raw };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { cursor: 8, pageSize: 5, shiftPages: 2, length: 15 },
  output: { cursor: 15, clamped: true },
} satisfies ToolExample<Input, Output>;
export const listPageBoundaryCursorShiftTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "list/list-page-boundary-cursor-shift",
    title: "List Page Boundary Cursor Shift Tool",
    description:
      "Calculate list page boundary cursor shift from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cursor: { type: "integer", minimum: 0 },
        pageSize: { type: "integer", minimum: 1 },
        shiftPages: { type: "integer" },
        length: { type: "integer", minimum: 0 },
      },
      required: ["cursor", "pageSize", "shiftPages", "length"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { cursor: { type: "integer" }, clamped: { type: "boolean" } },
      required: ["cursor", "clamped"],
    },
    ports: {
      inputs: [
        {
          id: "cursor",
          label: "Cursor",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "pageSize",
          label: "Page Size",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "shiftPages",
          label: "Shift Pages",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "cursor", label: "Cursor", valueType: { type: "integer" } },
        { id: "clamped", label: "Clamped", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = listPageBoundaryCursorShiftTool.execute;
export default listPageBoundaryCursorShiftTool;
