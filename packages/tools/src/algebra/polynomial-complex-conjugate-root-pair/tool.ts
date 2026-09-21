import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly realPart: number;
  readonly imaginaryPart: number;
};
export type Output = {
  readonly realParts: readonly number[];
  readonly imaginaryParts: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    realPart: { type: "number" },
    imaginaryPart: { type: "number" },
  },
  required: ["realPart", "imaginaryPart"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    realParts: { type: "array", maxItems: 256, items: { type: "number" } },
    imaginaryParts: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["realParts", "imaginaryParts"],
} as const;
/** Compute polynomial complex conjugate root pair from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { realPart, imaginaryPart } = input;
  const compute = (): Output => {
    domain(imaginaryPart >= 0);
    return {
      realParts: [realPart, realPart],
      imaginaryParts: [imaginaryPart, imaginaryPart === 0 ? 0 : -imaginaryPart],
    };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { realPart: 2, imaginaryPart: 3 },
  output: { realParts: [2, 2], imaginaryParts: [3, -3] },
} satisfies ToolExample<Input, Output>;
export const polynomialComplexConjugateRootPairTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "algebra/polynomial-complex-conjugate-root-pair",
  title: "Polynomial Complex Conjugate Root Pair Tool",
  description:
    "Compute polynomial complex conjugate root pair from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "realPart",
        label: "Real Part",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "imaginaryPart",
        label: "Imaginary Part",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      {
        id: "realParts",
        label: "Real Parts",
        valueType: { type: "list", items: { type: "number" } },
      },
      {
        id: "imaginaryParts",
        label: "Imaginary Parts",
        valueType: { type: "list", items: { type: "number" } },
      },
    ],
  },
});
export const run = polynomialComplexConjugateRootPairTool.execute;
export default polynomialComplexConjugateRootPairTool;
