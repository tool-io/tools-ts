import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly observed: number; readonly expected: number };
export type Output = { readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observed: { type: "integer", minimum: 0 },
    expected: { type: "integer", minimum: 0 },
  },
  required: ["observed", "expected"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "integer" } },
  required: ["gap"],
} as const;
/** Compare explicit observation counts with a supplied specimen record expectation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observed, expected } = request;
  const compute = (): Output => {
    H.integer(observed, 0);
    H.integer(expected, 0);
    return { gap: observed - expected };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observed: 6, expected: 8 },
  output: { gap: -2 },
} satisfies ToolExample<Input, Output>;
export const specimenBodyPartCountGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "zoology/specimen-body-part-count-gap",
    title: "Specimen Body Part Count Gap Tool",
    description:
      "Compare explicit observation counts with a supplied specimen record expectation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observed: { type: "integer", minimum: 0 },
        expected: { type: "integer", minimum: 0 },
      },
      required: ["observed", "expected"],
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
          id: "observed",
          label: "Observed",
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
export const run = specimenBodyPartCountGapTool.execute;
export default specimenBodyPartCountGapTool;
