import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cursor: number;
  readonly start: number;
  readonly deleteCount: number;
  readonly insertCount: number;
  readonly affinity: string;
  readonly length: number;
};
export type Output = { readonly newCursor: number; readonly newLength: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cursor: { type: "integer", minimum: 0 },
    start: { type: "integer", minimum: 0 },
    deleteCount: { type: "integer", minimum: 0 },
    insertCount: { type: "integer", minimum: 0 },
    affinity: { type: "string", maxLength: 8192, enum: ["before", "after"] },
    length: { type: "integer", minimum: 0 },
  },
  required: [
    "cursor",
    "start",
    "deleteCount",
    "insertCount",
    "affinity",
    "length",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    newCursor: { type: "integer" },
    newLength: { type: "integer" },
  },
  required: ["newCursor", "newLength"],
} as const;
/** Map a boundary cursor through a splice using an explicit affinity inside the replaced interval. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cursor, start, deleteCount, insertCount, affinity, length } = request;
  const compute = (): Output => {
    H.integer(length, 0);
    H.integer(cursor, 0, length);
    H.integer(start, 0, length);
    H.integer(deleteCount, 0, length - start);
    H.integer(insertCount, 0);
    H.domain(["before", "after"].includes(affinity));
    return {
      newCursor:
        cursor < start
          ? cursor
          : cursor > start + deleteCount
            ? cursor - deleteCount + insertCount
            : affinity === "before"
              ? start
              : start + insertCount,
      newLength: length - deleteCount + insertCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    cursor: 3,
    start: 3,
    deleteCount: 0,
    insertCount: 2,
    affinity: "after",
    length: 5,
  },
  output: { newCursor: 5, newLength: 7 },
} satisfies ToolExample<Input, Output>;
export const listSpliceCursorAffinityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "list/list-splice-cursor-affinity",
    title: "List Splice Cursor Affinity Tool",
    description:
      "Map a boundary cursor through a splice using an explicit affinity inside the replaced interval.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cursor: { type: "integer", minimum: 0 },
        start: { type: "integer", minimum: 0 },
        deleteCount: { type: "integer", minimum: 0 },
        insertCount: { type: "integer", minimum: 0 },
        affinity: {
          type: "string",
          maxLength: 8192,
          enum: ["before", "after"],
        },
        length: { type: "integer", minimum: 0 },
      },
      required: [
        "cursor",
        "start",
        "deleteCount",
        "insertCount",
        "affinity",
        "length",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        newCursor: { type: "integer" },
        newLength: { type: "integer" },
      },
      required: ["newCursor", "newLength"],
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
          id: "start",
          label: "Start",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "deleteCount",
          label: "Delete Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "insertCount",
          label: "Insert Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "affinity",
          label: "Affinity",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "newCursor",
          label: "New Cursor",
          valueType: { type: "integer" },
        },
        {
          id: "newLength",
          label: "New Length",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = listSpliceCursorAffinityTool.execute;
export default listSpliceCursorAffinityTool;
