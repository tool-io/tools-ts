import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly label: string;
  readonly alphabet: string;
  readonly weights: readonly number[];
  readonly modulus: number;
};
export type Output = {
  readonly checkIndex: number;
  readonly checkSymbol: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    label: { type: "string", maxLength: 8192 },
    alphabet: { type: "string", maxLength: 8192 },
    weights: { type: "array", maxItems: 256, items: { type: "integer" } },
    modulus: { type: "integer", minimum: 1 },
  },
  required: ["label", "alphabet", "weights", "modulus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    checkIndex: { type: "integer" },
    checkSymbol: { type: "string", maxLength: 8192 },
  },
  required: ["checkIndex", "checkSymbol"],
} as const;
/** Weighted modular checksum under an explicitly supplied distinct printable-ASCII alphabet; no identifier standard is asserted. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { label, alphabet, weights, modulus } = request;
  const compute = (): Output => {
    H.integer(modulus, 1, alphabet.length);
    H.domain(
      /^[\x21-\x7e]+(?![\s\S])/.test(alphabet) &&
        new Set(alphabet).size === alphabet.length &&
        weights.length === label.length &&
        [...label].every((x) => alphabet.includes(x)) &&
        weights.every((x) => x >= 0),
    );
    let sum = 0n;
    for (let i = 0; i < label.length; i++)
      sum += BigInt(alphabet.indexOf(label[i])) * BigInt(weights[i]);
    const checkIndex = Number(
      (BigInt(modulus) - (sum % BigInt(modulus))) % BigInt(modulus),
    );
    return { checkIndex, checkSymbol: alphabet[checkIndex] };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    label: "123",
    alphabet: "0123456789",
    weights: [1, 2, 3],
    modulus: 10,
  },
  output: { checkIndex: 6, checkSymbol: "6" },
} satisfies ToolExample<Input, Output>;
export const biobankSpecimenLabelCheckSymbolTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biobanking/biobank-specimen-label-check-symbol",
    title: "Biobank Specimen Label Check Symbol Tool",
    description:
      "Weighted modular checksum under an explicitly supplied distinct printable-ASCII alphabet; no identifier standard is asserted.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        label: { type: "string", maxLength: 8192 },
        alphabet: { type: "string", maxLength: 8192 },
        weights: { type: "array", maxItems: 256, items: { type: "integer" } },
        modulus: { type: "integer", minimum: 1 },
      },
      required: ["label", "alphabet", "weights", "modulus"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        checkIndex: { type: "integer" },
        checkSymbol: { type: "string", maxLength: 8192 },
      },
      required: ["checkIndex", "checkSymbol"],
    },
    ports: {
      inputs: [
        {
          id: "label",
          label: "Label",
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
        {
          id: "checkIndex",
          label: "Check Index",
          valueType: { type: "integer" },
        },
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
export const run = biobankSpecimenLabelCheckSymbolTool.execute;
export default biobankSpecimenLabelCheckSymbolTool;
