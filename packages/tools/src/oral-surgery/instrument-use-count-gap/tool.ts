import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly recorded: number; readonly expected: number };
export type Output = { readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recorded: { type: "integer", minimum: 0 },
    expected: { type: "integer", minimum: 0 },
  },
  required: ["recorded", "expected"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "integer" } },
  required: ["gap"],
} as const;
/** Calculate instrument use count gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recorded, expected } = request;
  const compute = (): Output => {
    H.integer(recorded, 0);
    H.integer(expected, 0);
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
export const instrumentUseCountGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "oral-surgery/instrument-use-count-gap",
    title: "Instrument Use Count Gap Tool",
    description:
      "Calculate instrument use count gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recorded: { type: "integer", minimum: 0 },
        expected: { type: "integer", minimum: 0 },
      },
      required: ["recorded", "expected"],
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
          id: "recorded",
          label: "Recorded",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "expected",
          label: "Expected",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [{ id: "gap", label: "Gap", valueType: { type: "integer" } }],
    },
  },
  calculate,
});
export const run = instrumentUseCountGapTool.execute;
export default instrumentUseCountGapTool;
