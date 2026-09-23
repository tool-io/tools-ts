import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bothPositive: number;
  readonly bothNegative: number;
  readonly firstOnly: number;
  readonly secondOnly: number;
};
export type Output = {
  readonly pairs: number;
  readonly discordant: number;
  readonly signedDiscordance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bothPositive: { type: "integer", minimum: 0 },
    bothNegative: { type: "integer", minimum: 0 },
    firstOnly: { type: "integer", minimum: 0 },
    secondOnly: { type: "integer", minimum: 0 },
  },
  required: ["bothPositive", "bothNegative", "firstOnly", "secondOnly"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pairs: { type: "integer" },
    discordant: { type: "integer" },
    signedDiscordance: { type: "integer" },
  },
  required: ["pairs", "discordant", "signedDiscordance"],
} as const;
/** Calculate pair matched discordance budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bothPositive, bothNegative, firstOnly, secondOnly } = request;
  const compute = (): Output => {
    H.integer(bothPositive, 0);
    H.integer(bothNegative, 0);
    H.integer(firstOnly, 0);
    H.integer(secondOnly, 0);
    return {
      pairs: bothPositive + bothNegative + firstOnly + secondOnly,
      discordant: firstOnly + secondOnly,
      signedDiscordance: firstOnly - secondOnly,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bothPositive: 10, bothNegative: 20, firstOnly: 5, secondOnly: 3 },
  output: { pairs: 38, discordant: 8, signedDiscordance: 2 },
} satisfies ToolExample<Input, Output>;
export const pairMatchedDiscordanceBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biostatistics/pair-matched-discordance-budget",
    title: "Pair Matched Discordance Budget Tool",
    description:
      "Calculate pair matched discordance budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bothPositive: { type: "integer", minimum: 0 },
        bothNegative: { type: "integer", minimum: 0 },
        firstOnly: { type: "integer", minimum: 0 },
        secondOnly: { type: "integer", minimum: 0 },
      },
      required: ["bothPositive", "bothNegative", "firstOnly", "secondOnly"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pairs: { type: "integer" },
        discordant: { type: "integer" },
        signedDiscordance: { type: "integer" },
      },
      required: ["pairs", "discordant", "signedDiscordance"],
    },
    ports: {
      inputs: [
        {
          id: "bothPositive",
          label: "Both Positive",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "bothNegative",
          label: "Both Negative",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "firstOnly",
          label: "First Only",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondOnly",
          label: "Second Only",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "pairs", label: "Pairs", valueType: { type: "integer" } },
        {
          id: "discordant",
          label: "Discordant",
          valueType: { type: "integer" },
        },
        {
          id: "signedDiscordance",
          label: "Signed Discordance",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = pairMatchedDiscordanceBudgetTool.execute;
export default pairMatchedDiscordanceBudgetTool;
