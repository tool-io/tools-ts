import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly deedId: string;
  readonly suppliedShareText: string;
  readonly denominatorConvention: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deedId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedShareText: { type: "string", maxLength: 8192, minLength: 1 },
    denominatorConvention: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["deedId", "suppliedShareText", "denominatorConvention"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve explicit deed-share notation and denominator convention without determining property rights. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { deedId, suppliedShareText, denominatorConvention } = request;
  const compute = (): Output => {
    H.domain(deedId.length > 0, "deedId");
    H.domain(suppliedShareText.length > 0, "suppliedShareText");
    H.domain(denominatorConvention.length > 0, "denominatorConvention");
    return {
      token: JSON.stringify([deedId, suppliedShareText, denominatorConvention]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    deedId: "DEED17",
    suppliedShareText: "3/12",
    denominatorConvention: "Source A basis",
  },
  output: { token: '["DEED17","3/12","Source A basis"]' },
} satisfies ToolExample<Input, Output>;
export const waqfDeedShareDenominatorLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "middle-eastern-studies",
        "middle eastern studies",
        "humanities",
      ],
      keywords: ["middle eastern studies", "humanities"],
    },
    id: "middle-eastern-studies/waqf-deed-share-denominator-label",
    title: "Waqf Deed Share Denominator Label",
    description:
      "Preserve explicit deed-share notation and denominator convention without determining property rights.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deedId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedShareText: { type: "string", maxLength: 8192, minLength: 1 },
        denominatorConvention: {
          type: "string",
          maxLength: 8192,
          minLength: 1,
        },
      },
      required: ["deedId", "suppliedShareText", "denominatorConvention"],
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
          id: "deedId",
          label: "Deed Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedShareText",
          label: "Supplied Share Text",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "denominatorConvention",
          label: "Denominator Convention",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = waqfDeedShareDenominatorLabelTool.execute;
export default waqfDeedShareDenominatorLabelTool;
