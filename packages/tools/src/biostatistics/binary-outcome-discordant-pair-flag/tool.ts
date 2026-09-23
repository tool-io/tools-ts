import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstOutcome: boolean;
  readonly secondOutcome: boolean;
};
export type Output = {
  readonly discordant: boolean;
  readonly direction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstOutcome: { type: "boolean" },
    secondOutcome: { type: "boolean" },
  },
  required: ["firstOutcome", "secondOutcome"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    discordant: { type: "boolean" },
    direction: { type: "integer" },
  },
  required: ["discordant", "direction"],
} as const;
/** Classify one supplied paired binary observation without a hypothesis test or outcome interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstOutcome, secondOutcome } = request;
  const compute = (): Output => {
    return {
      discordant: firstOutcome !== secondOutcome,
      direction: Number(secondOutcome) - Number(firstOutcome),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstOutcome: true, secondOutcome: false },
  output: { discordant: true, direction: -1 },
} satisfies ToolExample<Input, Output>;
export const binaryOutcomeDiscordantPairFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biostatistics/binary-outcome-discordant-pair-flag",
    title: "Binary Outcome Discordant Pair Flag Tool",
    description:
      "Classify one supplied paired binary observation without a hypothesis test or outcome interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstOutcome: { type: "boolean" },
        secondOutcome: { type: "boolean" },
      },
      required: ["firstOutcome", "secondOutcome"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        discordant: { type: "boolean" },
        direction: { type: "integer" },
      },
      required: ["discordant", "direction"],
    },
    ports: {
      inputs: [
        {
          id: "firstOutcome",
          label: "First Outcome",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "secondOutcome",
          label: "Second Outcome",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "discordant",
          label: "Discordant",
          valueType: { type: "boolean" },
        },
        { id: "direction", label: "Direction", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = binaryOutcomeDiscordantPairFlagTool.execute;
export default binaryOutcomeDiscordantPairFlagTool;
