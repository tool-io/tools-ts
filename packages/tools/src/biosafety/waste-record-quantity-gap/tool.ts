import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly recorded: number; readonly expected: number };
export type Output = { readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recorded: { type: "number", minimum: 0 },
    expected: { type: "number", minimum: 0 },
  },
  required: ["recorded", "expected"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "number" } },
  required: ["gap"],
} as const;
/** Reconcile supplied nonhazardous accounting quantities; no handling or disposal procedure. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recorded, expected } = request;
  const compute = (): Output => {
    H.domain(recorded >= 0 && expected >= 0);
    return { gap: recorded - expected };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recorded: 12, expected: 10 },
  output: { gap: 2 },
} satisfies ToolExample<Input, Output>;
export const wasteRecordQuantityGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biosafety/waste-record-quantity-gap",
    title: "Waste Record Quantity Gap Tool",
    description:
      "Reconcile supplied nonhazardous accounting quantities; no handling or disposal procedure.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recorded: { type: "number", minimum: 0 },
        expected: { type: "number", minimum: 0 },
      },
      required: ["recorded", "expected"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gap: { type: "number" } },
      required: ["gap"],
    },
    ports: {
      inputs: [
        {
          id: "recorded",
          label: "Recorded",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "expected",
          label: "Expected",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "gap", label: "Gap", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = wasteRecordQuantityGapTool.execute;
export default wasteRecordQuantityGapTool;
