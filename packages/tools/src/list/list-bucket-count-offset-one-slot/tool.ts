import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly counts: readonly number[];
  readonly slot: number;
};
export type Output = { readonly start: number; readonly end: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    counts: { type: "array", maxItems: 256, items: { type: "integer" } },
    slot: { type: "integer", minimum: 0 },
  },
  required: ["counts", "slot"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { start: { type: "integer" }, end: { type: "integer" } },
  required: ["start", "end"],
} as const;
/** Calculate list bucket count offset one slot from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { counts, slot } = input;
  const compute = (): Output => {
    H.domain(counts.every((x) => x >= 0));
    H.integer(slot, 0, counts.length - 1);
    const start = counts.slice(0, slot).reduce((a, b) => a + b, 0);
    return { start, end: start + counts[slot] };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { counts: [2, 3, 1], slot: 1 },
  output: { start: 2, end: 5 },
} satisfies ToolExample<Input, Output>;
export const listBucketCountOffsetOneSlotTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "list/list-bucket-count-offset-one-slot",
    title: "List Bucket Count Offset One Slot Tool",
    description:
      "Calculate list bucket count offset one slot from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        counts: { type: "array", maxItems: 256, items: { type: "integer" } },
        slot: { type: "integer", minimum: 0 },
      },
      required: ["counts", "slot"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { start: { type: "integer" }, end: { type: "integer" } },
      required: ["start", "end"],
    },
    ports: {
      inputs: [
        {
          id: "counts",
          label: "Counts",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "slot",
          label: "Slot",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "start", label: "Start", valueType: { type: "integer" } },
        { id: "end", label: "End", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = listBucketCountOffsetOneSlotTool.execute;
export default listBucketCountOffsetOneSlotTool;
