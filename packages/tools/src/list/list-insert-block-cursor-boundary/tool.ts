import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly length: number;
  readonly cursor: number;
  readonly blockLength: number;
  readonly selected: number;
  readonly shiftAtBoundary: boolean;
};
export type Output = { readonly newIndex: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "integer", minimum: 1 },
    cursor: { type: "integer", minimum: 0 },
    blockLength: { type: "integer", minimum: 0 },
    selected: { type: "integer", minimum: 0 },
    shiftAtBoundary: { type: "boolean" },
  },
  required: ["length", "cursor", "blockLength", "selected", "shiftAtBoundary"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { newIndex: { type: "integer" } },
  required: ["newIndex"],
} as const;
/** Calculate list insert block cursor boundary from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { length, cursor, blockLength, selected, shiftAtBoundary } = input;
  const compute = (): Output => {
    H.integer(length, 1);
    H.integer(cursor, 0, length);
    H.integer(blockLength, 0);
    H.integer(selected, 0, length - 1);
    return {
      newIndex:
        selected +
        (selected > cursor || (selected === cursor && shiftAtBoundary)
          ? blockLength
          : 0),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: {
    length: 5,
    cursor: 2,
    blockLength: 3,
    selected: 2,
    shiftAtBoundary: true,
  },
  output: { newIndex: 5 },
} satisfies ToolExample<Input, Output>;
export const listInsertBlockCursorBoundaryTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "list/list-insert-block-cursor-boundary",
    title: "List Insert Block Cursor Boundary Tool",
    description:
      "Calculate list insert block cursor boundary from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        length: { type: "integer", minimum: 1 },
        cursor: { type: "integer", minimum: 0 },
        blockLength: { type: "integer", minimum: 0 },
        selected: { type: "integer", minimum: 0 },
        shiftAtBoundary: { type: "boolean" },
      },
      required: [
        "length",
        "cursor",
        "blockLength",
        "selected",
        "shiftAtBoundary",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { newIndex: { type: "integer" } },
      required: ["newIndex"],
    },
    ports: {
      inputs: [
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "cursor",
          label: "Cursor",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "blockLength",
          label: "Block Length",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "selected",
          label: "Selected",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "shiftAtBoundary",
          label: "Shift At Boundary",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "newIndex", label: "New Index", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = listInsertBlockCursorBoundaryTool.execute;
export default listInsertBlockCursorBoundaryTool;
