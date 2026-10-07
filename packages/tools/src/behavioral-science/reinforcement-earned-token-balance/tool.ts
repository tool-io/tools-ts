import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingTokens: number;
  readonly earnedTokens: number;
  readonly redeemedTokens: number;
};
export type Output = { readonly closingBalance: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingTokens: { type: "integer", minimum: 0 },
    earnedTokens: { type: "integer", minimum: 0 },
    redeemedTokens: { type: "integer", minimum: 0 },
  },
  required: ["openingTokens", "earnedTokens", "redeemedTokens"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { closingBalance: { type: "integer" } },
  required: ["closingBalance"],
} as const;
/** Reconcile supplied reinforcement token counts without selecting or evaluating an intervention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingTokens, earnedTokens, redeemedTokens } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(openingTokens) &&
        openingTokens >= 0 &&
        openingTokens <= Number.MAX_SAFE_INTEGER,
      "openingTokens",
    ),
      openingTokens);
    (H.domain(
      Number.isSafeInteger(earnedTokens) &&
        earnedTokens >= 0 &&
        earnedTokens <= Number.MAX_SAFE_INTEGER,
      "earnedTokens",
    ),
      earnedTokens);
    (H.domain(
      Number.isSafeInteger(redeemedTokens) &&
        redeemedTokens >= 0 &&
        redeemedTokens <= Number.MAX_SAFE_INTEGER,
      "redeemedTokens",
    ),
      redeemedTokens);
    return {
      closingBalance: Number(
        BigInt(openingTokens) + BigInt(earnedTokens) - BigInt(redeemedTokens),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { openingTokens: 20, earnedTokens: 8, redeemedTokens: 5 },
  output: { closingBalance: 23 },
} satisfies ToolExample<Input, Output>;
export const reinforcementEarnedTokenBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["behavioral-science", "behavioral science", "psychology"],
      keywords: ["behavioral science", "psychology"],
    },
    id: "behavioral-science/reinforcement-earned-token-balance",
    title: "Reinforcement Earned Token Balance",
    description:
      "Reconcile supplied reinforcement token counts without selecting or evaluating an intervention.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingTokens: { type: "integer", minimum: 0 },
        earnedTokens: { type: "integer", minimum: 0 },
        redeemedTokens: { type: "integer", minimum: 0 },
      },
      required: ["openingTokens", "earnedTokens", "redeemedTokens"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { closingBalance: { type: "integer" } },
      required: ["closingBalance"],
    },
    ports: {
      inputs: [
        {
          id: "openingTokens",
          label: "Opening Tokens",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "earnedTokens",
          label: "Earned Tokens",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "redeemedTokens",
          label: "Redeemed Tokens",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "closingBalance",
          label: "Closing Balance",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = reinforcementEarnedTokenBalanceTool.execute;
export default reinforcementEarnedTokenBalanceTool;
