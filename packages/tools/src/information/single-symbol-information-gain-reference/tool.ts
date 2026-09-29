import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = { readonly posterior: number; readonly prior: number };
export type Output = { readonly gainBits: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { posterior: { type: "number" }, prior: { type: "number" } },
  required: ["posterior", "prior"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gainBits: { type: "number" } },
  required: ["gainBits"],
} as const;
/** Compute single symbol information gain reference from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { posterior, prior } = input;
  const compute = (): Output => {
    domain(posterior > 0 && posterior <= 1 && prior > 0 && prior <= 1);
    return { gainBits: Math.log2(posterior / prior) };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { posterior: 0.5, prior: 0.25 },
  output: { gainBits: 1 },
} satisfies ToolExample<Input, Output>;
export const singleSymbolInformationGainReferenceTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "information/single-symbol-information-gain-reference",
  title: "Single Symbol Information Gain Reference Tool",
  description:
    "Compute single symbol information gain reference from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "posterior",
        label: "Posterior",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "prior",
        label: "Prior",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      { id: "gainBits", label: "Gain Bits", valueType: { type: "number" } },
    ],
  },
});
export const run = singleSymbolInformationGainReferenceTool.execute;
export default singleSymbolInformationGainReferenceTool;
