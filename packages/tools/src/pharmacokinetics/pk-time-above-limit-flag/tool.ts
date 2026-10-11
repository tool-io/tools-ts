import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly concentration: number;
  readonly explicitLimit: number;
  readonly equalityCounts: boolean;
};
export type Output = { readonly aboveUnderPolicy: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    concentration: { type: "number", minimum: 0 },
    explicitLimit: { type: "number", minimum: 0 },
    equalityCounts: { type: "boolean" },
  },
  required: ["concentration", "explicitLimit", "equalityCounts"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { aboveUnderPolicy: { type: "boolean" } },
  required: ["aboveUnderPolicy"],
} as const;
/** Compare one explicit concentration with a supplied limit and equality policy without estimating time above threshold. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { concentration, explicitLimit, equalityCounts } = request;
  const compute = (): Output => {
    H.domain(concentration >= 0 && explicitLimit >= 0, "concentration");
    return {
      aboveUnderPolicy: equalityCounts
        ? concentration >= explicitLimit
        : concentration > explicitLimit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { concentration: 4, explicitLimit: 3, equalityCounts: false },
  output: { aboveUnderPolicy: true },
} satisfies ToolExample<Input, Output>;
export const pkTimeAboveLimitFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["pharmacokinetics", "pharmacy"],
      keywords: ["pharmacokinetics", "pharmacy"],
    },
    id: "pharmacokinetics/pk-time-above-limit-flag",
    title: "PK Time Above Limit Flag",
    description:
      "Compare one explicit concentration with a supplied limit and equality policy without estimating time above threshold.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        concentration: { type: "number", minimum: 0 },
        explicitLimit: { type: "number", minimum: 0 },
        equalityCounts: { type: "boolean" },
      },
      required: ["concentration", "explicitLimit", "equalityCounts"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { aboveUnderPolicy: { type: "boolean" } },
      required: ["aboveUnderPolicy"],
    },
    ports: {
      inputs: [
        {
          id: "concentration",
          label: "Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "explicitLimit",
          label: "Explicit Limit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "equalityCounts",
          label: "Equality Counts",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "aboveUnderPolicy",
          label: "Above Under Policy",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = pkTimeAboveLimitFlagTool.execute;
export default pkTimeAboveLimitFlagTool;
