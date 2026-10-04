import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly depth: number; readonly doubleOuter: boolean };
export type Output = { readonly opening: string; readonly closing: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    depth: { type: "integer", minimum: 0 },
    doubleOuter: { type: "boolean" },
  },
  required: ["depth", "doubleOuter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    opening: { type: "string", maxLength: 8192 },
    closing: { type: "string", maxLength: 8192 },
  },
  required: ["opening", "closing"],
} as const;
/** Calculate typographic quote nesting pair from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { depth, doubleOuter } = request;
  const compute = (): Output => {
    H.integer(depth, 0);
    const double = (depth % 2 === 0) === doubleOuter;
    return { opening: double ? "“" : "‘", closing: double ? "”" : "’" };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { depth: 1, doubleOuter: true },
  output: { opening: "‘", closing: "’" },
} satisfies ToolExample<Input, Output>;
export const typographicQuoteNestingPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "text/typographic-quote-nesting-pair",
    title: "Typographic Quote Nesting Pair Tool",
    description:
      "Calculate typographic quote nesting pair from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        depth: { type: "integer", minimum: 0 },
        doubleOuter: { type: "boolean" },
      },
      required: ["depth", "doubleOuter"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        opening: { type: "string", maxLength: 8192 },
        closing: { type: "string", maxLength: 8192 },
      },
      required: ["opening", "closing"],
    },
    ports: {
      inputs: [
        {
          id: "depth",
          label: "Depth",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "doubleOuter",
          label: "Double Outer",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "opening", label: "Opening", valueType: { type: "string" } },
        { id: "closing", label: "Closing", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = typographicQuoteNestingPairTool.execute;
export default typographicQuoteNestingPairTool;
