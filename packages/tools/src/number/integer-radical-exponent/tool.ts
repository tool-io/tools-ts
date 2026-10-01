import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly primeExponents: readonly number[] };
export type Output = {
  readonly radicalExponents: readonly number[];
  readonly radicalPreservesInput: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    primeExponents: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["primeExponents"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radicalExponents: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    radicalPreservesInput: { type: "boolean" },
  },
  required: ["radicalExponents", "radicalPreservesInput"],
} as const;
/** Reduce supplied nonnegative prime-factor exponents to squarefree radical exponents; primality of the implicit bases is caller supplied. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { primeExponents } = request;
  const compute = (): Output => {
    H.domain(primeExponents.every((x) => x >= 0));
    return {
      radicalExponents: primeExponents.map((x) => (x === 0 ? 0 : 1)),
      radicalPreservesInput: primeExponents.every((x) => x <= 1),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { primeExponents: [2, 0, 3] },
  output: { radicalExponents: [1, 0, 1], radicalPreservesInput: false },
} satisfies ToolExample<Input, Output>;
export const integerRadicalExponentTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "number/integer-radical-exponent",
    title: "Integer Radical Exponent Tool",
    description:
      "Reduce supplied nonnegative prime-factor exponents to squarefree radical exponents; primality of the implicit bases is caller supplied.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        primeExponents: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["primeExponents"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        radicalExponents: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        radicalPreservesInput: { type: "boolean" },
      },
      required: ["radicalExponents", "radicalPreservesInput"],
    },
    ports: {
      inputs: [
        {
          id: "primeExponents",
          label: "Prime Exponents",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "radicalExponents",
          label: "Radical Exponents",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "radicalPreservesInput",
          label: "Radical Preserves Input",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = integerRadicalExponentTool.execute;
export default integerRadicalExponentTool;
