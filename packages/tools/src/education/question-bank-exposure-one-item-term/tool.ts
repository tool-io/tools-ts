import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly seen: number; readonly administrations: number };
export type Output = { readonly exposureFraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    seen: { type: "integer", minimum: 0 },
    administrations: { type: "integer", minimum: 1 },
  },
  required: ["seen", "administrations"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { exposureFraction: { type: "number" } },
  required: ["exposureFraction"],
} as const;
/** Calculate question bank exposure one item term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { seen, administrations } = request;
  const compute = (): Output => {
    H.integer(administrations, 1);
    H.integer(seen, 0, administrations);
    return { exposureFraction: seen / administrations };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { seen: 20, administrations: 100 },
  output: { exposureFraction: 0.2 },
} satisfies ToolExample<Input, Output>;
export const questionBankExposureOneItemTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "education/question-bank-exposure-one-item-term",
    title: "Question Bank Exposure One Item Term Tool",
    description:
      "Calculate question bank exposure one item term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        seen: { type: "integer", minimum: 0 },
        administrations: { type: "integer", minimum: 1 },
      },
      required: ["seen", "administrations"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { exposureFraction: { type: "number" } },
      required: ["exposureFraction"],
    },
    ports: {
      inputs: [
        {
          id: "seen",
          label: "Seen",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "administrations",
          label: "Administrations",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "exposureFraction",
          label: "Exposure Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = questionBankExposureOneItemTermTool.execute;
export default questionBankExposureOneItemTermTool;
