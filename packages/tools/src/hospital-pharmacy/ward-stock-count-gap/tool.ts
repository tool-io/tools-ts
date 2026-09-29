import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly expected: number; readonly observed: number };
export type Output = { readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expected: { type: "integer", minimum: 0 },
    observed: { type: "integer", minimum: 0 },
  },
  required: ["expected", "observed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "integer" } },
  required: ["gap"],
} as const;
/** Calculate ward stock count gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { expected, observed } = request;
  const compute = (): Output => {
    H.integer(expected, 0);
    H.integer(observed, 0);
    return { gap: observed - expected };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { expected: 100, observed: 98 },
  output: { gap: -2 },
} satisfies ToolExample<Input, Output>;
export const wardStockCountGapTool = H.defineSchemaCalculation<Input, Output>({
  ...{
    id: "hospital-pharmacy/ward-stock-count-gap",
    title: "Ward Stock Count Gap Tool",
    description:
      "Calculate ward stock count gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expected: { type: "integer", minimum: 0 },
        observed: { type: "integer", minimum: 0 },
      },
      required: ["expected", "observed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gap: { type: "integer" } },
      required: ["gap"],
    },
    ports: {
      inputs: [
        {
          id: "expected",
          label: "Expected",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "gap", label: "Gap", valueType: { type: "integer" } }],
    },
  },
  calculate,
});
export const run = wardStockCountGapTool.execute;
export default wardStockCountGapTool;
