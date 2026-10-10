import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly communityCredit: string;
  readonly suppliedAuthorityCredit: string;
  readonly communityFirst: boolean;
};
export type Output = { readonly creditLine: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    communityCredit: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedAuthorityCredit: { type: "string", maxLength: 8192, minLength: 1 },
    communityFirst: { type: "boolean" },
  },
  required: ["communityCredit", "suppliedAuthorityCredit", "communityFirst"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { creditLine: { type: "string", maxLength: 8192 } },
  required: ["creditLine"],
} as const;
/** Order explicitly supplied community and authority credits under a supplied preference without assigning cultural authority. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { communityCredit, suppliedAuthorityCredit, communityFirst } = request;
  const compute = (): Output => {
    H.domain(
      communityCredit.length > 0 && suppliedAuthorityCredit.length > 0,
      "communityCredit",
    );
    return {
      creditLine: communityFirst
        ? communityCredit + "; " + suppliedAuthorityCredit
        : suppliedAuthorityCredit + "; " + communityCredit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    communityCredit: "Community A",
    suppliedAuthorityCredit: "Authority record B",
    communityFirst: true,
  },
  output: { creditLine: "Community A; Authority record B" },
} satisfies ToolExample<Input, Output>;
export const communityAttributionAuthorityOrderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["indigenous-studies", "indigenous studies", "humanities"],
      keywords: ["indigenous studies", "humanities"],
    },
    id: "indigenous-studies/community-attribution-authority-order",
    title: "Community Attribution Authority Order",
    description:
      "Order explicitly supplied community and authority credits under a supplied preference without assigning cultural authority.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        communityCredit: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedAuthorityCredit: {
          type: "string",
          maxLength: 8192,
          minLength: 1,
        },
        communityFirst: { type: "boolean" },
      },
      required: [
        "communityCredit",
        "suppliedAuthorityCredit",
        "communityFirst",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { creditLine: { type: "string", maxLength: 8192 } },
      required: ["creditLine"],
    },
    ports: {
      inputs: [
        {
          id: "communityCredit",
          label: "Community Credit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedAuthorityCredit",
          label: "Supplied Authority Credit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "communityFirst",
          label: "Community First",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "creditLine",
          label: "Credit Line",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = communityAttributionAuthorityOrderTool.execute;
export default communityAttributionAuthorityOrderTool;
