import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly cents: number };
export type Output = { readonly multiplier: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { cents: { type: "number" } },
  required: ["cents"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { multiplier: { type: "number" } },
  required: ["multiplier"],
} as const;
/** Calculate cents to frequency multiplier from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cents } = request;
  const compute = (): Output => {
    return { multiplier: 2 ** (cents / 1200) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cents: 1200 },
  output: { multiplier: 2 },
} satisfies ToolExample<Input, Output>;
export const centsToFrequencyMultiplierTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "convert/cents-to-frequency-multiplier",
    title: "Cents To Frequency Multiplier Tool",
    description:
      "Calculate cents to frequency multiplier from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { cents: { type: "number" } },
      required: ["cents"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { multiplier: { type: "number" } },
      required: ["multiplier"],
    },
    ports: {
      inputs: [
        {
          id: "cents",
          label: "Cents",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "multiplier",
          label: "Multiplier",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = centsToFrequencyMultiplierTool.execute;
export default centsToFrequencyMultiplierTool;
