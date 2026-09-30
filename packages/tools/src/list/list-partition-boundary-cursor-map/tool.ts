import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  integer,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly length: number;
  readonly boundary: number;
  readonly cursor: number;
};
export type Output = {
  readonly partition: string;
  readonly localCursor: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "integer", minimum: 0 },
    boundary: { type: "integer", minimum: 0 },
    cursor: { type: "integer", minimum: 0 },
  },
  required: ["length", "boundary", "cursor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    partition: { type: "string", maxLength: 8192 },
    localCursor: { type: "integer" },
  },
  required: ["partition", "localCursor"],
} as const;
/** Compute list partition boundary cursor map from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { length, boundary, cursor } = input;
  const compute = (): Output => {
    integer(length);
    integer(boundary, 0, length);
    integer(cursor, 0, length);
    return {
      partition: cursor < boundary ? "left" : "right",
      localCursor: cursor < boundary ? cursor : cursor - boundary,
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { length: 8, boundary: 3, cursor: 5 },
  output: { partition: "right", localCursor: 2 },
} satisfies ToolExample<Input, Output>;
export const listPartitionBoundaryCursorMapTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "list/list-partition-boundary-cursor-map",
  title: "List Partition Boundary Cursor Map Tool",
  description:
    "Compute list partition boundary cursor map from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "length",
        label: "Length",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "boundary",
        label: "Boundary",
        required: true,
        valueType: { type: "integer" },
      },
      {
        id: "cursor",
        label: "Cursor",
        required: true,
        valueType: { type: "integer" },
      },
    ],
    outputs: [
      { id: "partition", label: "Partition", valueType: { type: "string" } },
      {
        id: "localCursor",
        label: "Local Cursor",
        valueType: { type: "integer" },
      },
    ],
  },
});
export const run = listPartitionBoundaryCursorMapTool.execute;
export default listPartitionBoundaryCursorMapTool;
