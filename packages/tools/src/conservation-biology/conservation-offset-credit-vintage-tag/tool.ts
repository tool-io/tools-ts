import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly creditId: string;
  readonly suppliedVintage: string;
  readonly sourceRegistry: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    creditId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedVintage: { type: "string", maxLength: 8192, minLength: 1 },
    sourceRegistry: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["creditId", "suppliedVintage", "sourceRegistry"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit conservation-credit vintage metadata without verifying credit validity or ecological equivalence. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { creditId, suppliedVintage, sourceRegistry } = request;
  const compute = (): Output => {
    H.domain(creditId.length > 0, "creditId");
    H.domain(suppliedVintage.length > 0, "suppliedVintage");
    H.domain(sourceRegistry.length > 0, "sourceRegistry");
    return {
      token: JSON.stringify([creditId, suppliedVintage, sourceRegistry]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    creditId: "C17",
    suppliedVintage: "2024",
    sourceRegistry: "registry R4",
  },
  output: { token: '["C17","2024","registry R4"]' },
} satisfies ToolExample<Input, Output>;
export const conservationOffsetCreditVintageTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["conservation-biology", "conservation biology", "biology"],
      keywords: ["conservation biology", "biology"],
    },
    id: "conservation-biology/conservation-offset-credit-vintage-tag",
    title: "Conservation Offset Credit Vintage Tag",
    description:
      "Preserve explicit conservation-credit vintage metadata without verifying credit validity or ecological equivalence.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        creditId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedVintage: { type: "string", maxLength: 8192, minLength: 1 },
        sourceRegistry: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["creditId", "suppliedVintage", "sourceRegistry"],
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
          id: "creditId",
          label: "Credit Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedVintage",
          label: "Supplied Vintage",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceRegistry",
          label: "Source Registry",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = conservationOffsetCreditVintageTagTool.execute;
export default conservationOffsetCreditVintageTagTool;
