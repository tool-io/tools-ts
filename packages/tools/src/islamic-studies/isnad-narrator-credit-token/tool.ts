import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly chainId: string;
  readonly narratorWording: string;
  readonly sourceReference: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    chainId: { type: "string", maxLength: 8192, minLength: 1 },
    narratorWording: { type: "string", maxLength: 8192, minLength: 1 },
    sourceReference: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["chainId", "narratorWording", "sourceReference"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record a supplied narrator attribution and source without resolving identities or evaluating an isnad. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { chainId, narratorWording, sourceReference } = request;
  const compute = (): Output => {
    H.domain(chainId.length > 0, "chainId");
    H.domain(narratorWording.length > 0, "narratorWording");
    H.domain(sourceReference.length > 0, "sourceReference");
    return {
      token: JSON.stringify([chainId, narratorWording, sourceReference]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    chainId: "CHAIN17",
    narratorWording: "Narrator A",
    sourceReference: "Edition p. 25",
  },
  output: { token: '["CHAIN17","Narrator A","Edition p. 25"]' },
} satisfies ToolExample<Input, Output>;
export const isnadNarratorCreditTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["islamic-studies", "islamic studies", "humanities"],
      keywords: ["islamic studies", "humanities"],
    },
    id: "islamic-studies/isnad-narrator-credit-token",
    title: "Isnad Narrator Credit Token",
    description:
      "Record a supplied narrator attribution and source without resolving identities or evaluating an isnad.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        chainId: { type: "string", maxLength: 8192, minLength: 1 },
        narratorWording: { type: "string", maxLength: 8192, minLength: 1 },
        sourceReference: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["chainId", "narratorWording", "sourceReference"],
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
          id: "chainId",
          label: "Chain Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "narratorWording",
          label: "Narrator Wording",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceReference",
          label: "Source Reference",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = isnadNarratorCreditTokenTool.execute;
export default isnadNarratorCreditTokenTool;
