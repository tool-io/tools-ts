import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly codewords: readonly string[] };
export type Output = {
  readonly prefixFree: boolean;
  readonly witness: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    codewords: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["codewords"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    prefixFree: { type: "boolean" },
    witness: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["prefixFree", "witness"],
} as const;
/** Return the first ordered proper-prefix witness among distinct supplied codewords. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { codewords } = request;
  const compute = (): Output => {
    H.domain(new Set(codewords).size === codewords.length);
    for (let i = 0; i < codewords.length; i++)
      for (let j = 0; j < codewords.length; j++)
        if (i !== j && codewords[j].startsWith(codewords[i]))
          return { prefixFree: false, witness: [codewords[i], codewords[j]] };
    return { prefixFree: true, witness: [] };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { codewords: ["0", "01", "1"] },
  output: { prefixFree: false, witness: ["0", "01"] },
} satisfies ToolExample<Input, Output>;
export const prefixCodeTerminationAmbiguityWitnessTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "information/prefix-code-termination-ambiguity-witness",
      title: "Prefix Code Termination Ambiguity Witness Tool",
      description:
        "Return the first ordered proper-prefix witness among distinct supplied codewords.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          codewords: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["codewords"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          prefixFree: { type: "boolean" },
          witness: {
            type: "array",
            maxItems: 256,
            items: { type: "string", maxLength: 8192 },
          },
        },
        required: ["prefixFree", "witness"],
      },
      ports: {
        inputs: [
          {
            id: "codewords",
            label: "Codewords",
            required: true,
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
        outputs: [
          {
            id: "prefixFree",
            label: "Prefix Free",
            valueType: { type: "boolean" },
          },
          {
            id: "witness",
            label: "Witness",
            valueType: { type: "list", items: { type: "string" } },
          },
        ],
      },
    },
    calculate,
  });
export const run = prefixCodeTerminationAmbiguityWitnessTool.execute;
export default prefixCodeTerminationAmbiguityWitnessTool;
