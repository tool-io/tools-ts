import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reference: string;
  readonly alphabet: string;
  readonly weights: readonly number[];
  readonly modulus: number;
};
export type Output = {
  readonly remainder: number;
  readonly checkSymbol: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reference: { type: "string", maxLength: 8192 },
    alphabet: { type: "string", maxLength: 8192 },
    weights: { type: "array", maxItems: 256, items: { type: "integer" } },
    modulus: { type: "integer", minimum: 1 },
  },
  required: ["reference", "alphabet", "weights", "modulus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainder: { type: "integer" },
    checkSymbol: { type: "string", maxLength: 8192 },
  },
  required: ["remainder", "checkSymbol"],
} as const;
/** Caller-defined weighted modular check symbol with zero-based alphabet values, not a national or agency identifier standard. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reference, alphabet, weights, modulus } = request;
  const compute = (): Output => {
    H.domain(
      alphabet.length > 0 &&
        new Set(alphabet).size === alphabet.length &&
        /^[\x21-\x7e]+(?![\s\S])/.test(alphabet) &&
        reference.length === weights.length &&
        weights.every((x) => x >= 0),
    );
    H.integer(modulus, 1, alphabet.length);
    let remainder = 0n;
    for (let i = 0; i < reference.length; i++) {
      const value = alphabet.indexOf(reference[i]);
      H.domain(
        value >= 0,
        "reference",
        "Use only characters in the supplied check alphabet.",
      );
      remainder =
        (remainder + BigInt(value) * BigInt(weights[i])) % BigInt(modulus);
    }
    const r = Number(remainder);
    return { remainder: r, checkSymbol: alphabet[(modulus - r) % modulus] };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    reference: "123",
    alphabet: "0123456789",
    weights: [1, 2, 3],
    modulus: 10,
  },
  output: { remainder: 4, checkSymbol: "6" },
} satisfies ToolExample<Input, Output>;
export const officeFileReferenceCheckSymbolTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "administrative-science/office-file-reference-check-symbol",
    title: "Office File Reference Check Symbol Tool",
    description:
      "Caller-defined weighted modular check symbol with zero-based alphabet values, not a national or agency identifier standard.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reference: { type: "string", maxLength: 8192 },
        alphabet: { type: "string", maxLength: 8192 },
        weights: { type: "array", maxItems: 256, items: { type: "integer" } },
        modulus: { type: "integer", minimum: 1 },
      },
      required: ["reference", "alphabet", "weights", "modulus"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainder: { type: "integer" },
        checkSymbol: { type: "string", maxLength: 8192 },
      },
      required: ["remainder", "checkSymbol"],
    },
    ports: {
      inputs: [
        {
          id: "reference",
          label: "Reference",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "alphabet",
          label: "Alphabet",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "weights",
          label: "Weights",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "modulus",
          label: "Modulus",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "remainder", label: "Remainder", valueType: { type: "integer" } },
        {
          id: "checkSymbol",
          label: "Check Symbol",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = officeFileReferenceCheckSymbolTool.execute;
export default officeFileReferenceCheckSymbolTool;
