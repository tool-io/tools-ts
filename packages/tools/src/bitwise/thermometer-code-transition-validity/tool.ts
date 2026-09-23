import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly word: number; readonly width: number };
export type Output = { readonly valid: boolean; readonly transitions: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    word: { type: "integer", minimum: 0 },
    width: { type: "integer", minimum: 1, maximum: 32 },
  },
  required: ["word", "width"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { valid: { type: "boolean" }, transitions: { type: "integer" } },
  required: ["valid", "transitions"],
} as const;
/** Calculate thermometer code transition validity from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { word, width } = input;
  const compute = (): Output => {
    H.integer(width, 1, 32);
    H.integer(word, 0, 2 ** width - 1);
    let transitions = 0;
    for (let i = 1; i < width; i++)
      if (Math.floor(word / 2 ** i) % 2 !== Math.floor(word / 2 ** (i - 1)) % 2)
        transitions++;
    return { valid: (BigInt(word) & (BigInt(word) + 1n)) === 0n, transitions };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { word: 15, width: 8 },
  output: { valid: true, transitions: 1 },
} satisfies ToolExample<Input, Output>;
export const thermometerCodeTransitionValidityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bitwise/thermometer-code-transition-validity",
    title: "Thermometer Code Transition Validity Tool",
    description:
      "Calculate thermometer code transition validity from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        word: { type: "integer", minimum: 0 },
        width: { type: "integer", minimum: 1, maximum: 32 },
      },
      required: ["word", "width"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        valid: { type: "boolean" },
        transitions: { type: "integer" },
      },
      required: ["valid", "transitions"],
    },
    ports: {
      inputs: [
        {
          id: "word",
          label: "Word",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "width",
          label: "Width",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "valid", label: "Valid", valueType: { type: "boolean" } },
        {
          id: "transitions",
          label: "Transitions",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = thermometerCodeTransitionValidityTool.execute;
export default thermometerCodeTransitionValidityTool;
