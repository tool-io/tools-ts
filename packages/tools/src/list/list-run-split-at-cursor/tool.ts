import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly runLength: number; readonly cursor: number };
export type Output = { readonly left: number; readonly right: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    runLength: { type: "integer", minimum: 0 },
    cursor: { type: "integer", minimum: 0 },
  },
  required: ["runLength", "cursor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { left: { type: "integer" }, right: { type: "integer" } },
  required: ["left", "right"],
} as const;
/** Calculate list run split at cursor from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { runLength, cursor } = input;
  const compute = (): Output => {
    H.integer(runLength, 0);
    H.integer(cursor, 0, runLength);
    return { left: cursor, right: runLength - cursor };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { runLength: 7, cursor: 3 },
  output: { left: 3, right: 4 },
} satisfies ToolExample<Input, Output>;
export const listRunSplitAtCursorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "list/list-run-split-at-cursor",
    title: "List Run Split At Cursor Tool",
    description:
      "Calculate list run split at cursor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        runLength: { type: "integer", minimum: 0 },
        cursor: { type: "integer", minimum: 0 },
      },
      required: ["runLength", "cursor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { left: { type: "integer" }, right: { type: "integer" } },
      required: ["left", "right"],
    },
    ports: {
      inputs: [
        {
          id: "runLength",
          label: "Run Length",
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
        { id: "left", label: "Left", valueType: { type: "integer" } },
        { id: "right", label: "Right", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = listRunSplitAtCursorTool.execute;
export default listRunSplitAtCursorTool;
