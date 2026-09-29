import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly original: number; readonly quantized: number };
export type Output = { readonly errorBits: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { original: { type: "number" }, quantized: { type: "number" } },
  required: ["original", "quantized"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { errorBits: { type: "number" } },
  required: ["errorBits"],
} as const;
/** Compute probability quantization surprisal error from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { original, quantized } = input;
  const compute = (): Output => {
    domain(original > 0 && original <= 1 && quantized > 0 && quantized <= 1);
    return { errorBits: Math.log2(original / quantized) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { original: 0.5, quantized: 0.25 },
  output: { errorBits: 1 },
} satisfies ToolExample<Input, Output>;
export const probabilityQuantizationSurprisalErrorTool =
  defineSchemaCalculation<Input, Output>({
    id: "information/probability-quantization-surprisal-error",
    title: "Probability Quantization Surprisal Error Tool",
    description:
      "Compute probability quantization surprisal error from explicit bounded inputs.",
    calculate,
    inputSchema,
    outputSchema,
    ports: {
      inputs: [
        {
          id: "original",
          label: "Original",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "quantized",
          label: "Quantized",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "errorBits", label: "Error Bits", valueType: { type: "number" } },
      ],
    },
  });
export const run = probabilityQuantizationSurprisalErrorTool.execute;
export default probabilityQuantizationSurprisalErrorTool;
