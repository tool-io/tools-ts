import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recorded: number;
  readonly zero: number;
  readonly reference: number;
};
export type Output = { readonly corrected: number; readonly gap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recorded: { type: "number" },
    zero: { type: "number" },
    reference: { type: "number" },
  },
  required: ["recorded", "zero", "reference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { corrected: { type: "number" }, gap: { type: "number" } },
  required: ["corrected", "gap"],
} as const;
/** Calculate insole zero offset reference from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recorded, zero, reference } = request;
  const compute = (): Output => {
    return { corrected: recorded - zero, gap: recorded - zero - reference };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recorded: 12, zero: 2, reference: 8 },
  output: { corrected: 10, gap: 2 },
} satisfies ToolExample<Input, Output>;
export const insoleZeroOffsetReferenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "podiatry/insole-zero-offset-reference",
    title: "Insole Zero Offset Reference Tool",
    description:
      "Calculate insole zero offset reference from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recorded: { type: "number" },
        zero: { type: "number" },
        reference: { type: "number" },
      },
      required: ["recorded", "zero", "reference"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { corrected: { type: "number" }, gap: { type: "number" } },
      required: ["corrected", "gap"],
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
          id: "zero",
          label: "Zero",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reference",
          label: "Reference",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "corrected", label: "Corrected", valueType: { type: "number" } },
        { id: "gap", label: "Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = insoleZeroOffsetReferenceTool.execute;
export default insoleZeroOffsetReferenceTool;
