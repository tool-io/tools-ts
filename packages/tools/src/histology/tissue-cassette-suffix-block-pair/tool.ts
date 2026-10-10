import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cassetteId: string;
  readonly blockSuffix: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cassetteId: { type: "string", maxLength: 8192, minLength: 1 },
    blockSuffix: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["cassetteId", "blockSuffix"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Encode an exact supplied tissue cassette identifier and block suffix without assigning specimen identity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cassetteId, blockSuffix } = request;
  const compute = (): Output => {
    H.domain(cassetteId.length > 0, "cassetteId");
    H.domain(blockSuffix.length > 0, "blockSuffix");
    return { token: JSON.stringify([cassetteId, blockSuffix]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cassetteId: "C17", blockSuffix: "A" },
  output: { token: '["C17","A"]' },
} satisfies ToolExample<Input, Output>;
export const tissueCassetteSuffixBlockPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "histology/tissue-cassette-suffix-block-pair",
    title: "Tissue Cassette Suffix Block Pair Tool",
    description:
      "Encode an exact supplied tissue cassette identifier and block suffix without assigning specimen identity.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cassetteId: { type: "string", maxLength: 8192, minLength: 1 },
        blockSuffix: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["cassetteId", "blockSuffix"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { token: { type: "string", maxLength: 8192 } },
      required: ["token"],
    },
    ports: {
      inputs: [
        {
          id: "cassetteId",
          label: "Cassette Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "blockSuffix",
          label: "Block Suffix",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = tissueCassetteSuffixBlockPairTool.execute;
export default tissueCassetteSuffixBlockPairTool;
