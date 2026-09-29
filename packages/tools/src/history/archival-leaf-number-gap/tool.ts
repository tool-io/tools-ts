import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly first: number; readonly second: number };
export type Output = { readonly gap: number; readonly skippedLeaves: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    first: { type: "integer", minimum: 1 },
    second: { type: "integer", minimum: 1 },
  },
  required: ["first", "second"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "integer" }, skippedLeaves: { type: "integer" } },
  required: ["gap", "skippedLeaves"],
} as const;
/** Calculate archival leaf number gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { first, second } = request;
  const compute = (): Output => {
    H.integer(first, 1);
    H.integer(second, 1);
    return {
      gap: second - first,
      skippedLeaves: Math.max(0, Math.abs(second - first) - 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { first: 12, second: 16 },
  output: { gap: 4, skippedLeaves: 3 },
} satisfies ToolExample<Input, Output>;
export const archivalLeafNumberGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "history/archival-leaf-number-gap",
    title: "Archival Leaf Number Gap Tool",
    description:
      "Calculate archival leaf number gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        first: { type: "integer", minimum: 1 },
        second: { type: "integer", minimum: 1 },
      },
      required: ["first", "second"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gap: { type: "integer" },
        skippedLeaves: { type: "integer" },
      },
      required: ["gap", "skippedLeaves"],
    },
    ports: {
      inputs: [
        {
          id: "first",
          label: "First",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "second",
          label: "Second",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "gap", label: "Gap", valueType: { type: "integer" } },
        {
          id: "skippedLeaves",
          label: "Skipped Leaves",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = archivalLeafNumberGapTool.execute;
export default archivalLeafNumberGapTool;
