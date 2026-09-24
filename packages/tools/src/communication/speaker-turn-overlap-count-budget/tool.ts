import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstTurnCount: number;
  readonly secondTurnCount: number;
  readonly sharedTurnIds: number;
};
export type Output = { readonly distinctTurns: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstTurnCount: { type: "integer", minimum: 0 },
    secondTurnCount: { type: "integer", minimum: 0 },
    sharedTurnIds: { type: "integer", minimum: 0 },
  },
  required: ["firstTurnCount", "secondTurnCount", "sharedTurnIds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { distinctTurns: { type: "integer" } },
  required: ["distinctTurns"],
} as const;
/** Deduplicate turn IDs shared by two supplied annotation sets; not a duration or interruption count. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstTurnCount, secondTurnCount, sharedTurnIds } = request;
  const compute = (): Output => {
    H.integer(firstTurnCount, 0);
    H.integer(secondTurnCount, 0);
    H.integer(sharedTurnIds, 0, Math.min(firstTurnCount, secondTurnCount));
    return { distinctTurns: firstTurnCount + secondTurnCount - sharedTurnIds };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstTurnCount: 8, secondTurnCount: 7, sharedTurnIds: 3 },
  output: { distinctTurns: 12 },
} satisfies ToolExample<Input, Output>;
export const speakerTurnOverlapCountBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "communication/speaker-turn-overlap-count-budget",
    title: "Speaker Turn Overlap Count Budget Tool",
    description:
      "Deduplicate turn IDs shared by two supplied annotation sets; not a duration or interruption count.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstTurnCount: { type: "integer", minimum: 0 },
        secondTurnCount: { type: "integer", minimum: 0 },
        sharedTurnIds: { type: "integer", minimum: 0 },
      },
      required: ["firstTurnCount", "secondTurnCount", "sharedTurnIds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { distinctTurns: { type: "integer" } },
      required: ["distinctTurns"],
    },
    ports: {
      inputs: [
        {
          id: "firstTurnCount",
          label: "First Turn Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "secondTurnCount",
          label: "Second Turn Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sharedTurnIds",
          label: "Shared Turn Ids",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "distinctTurns",
          label: "Distinct Turns",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = speakerTurnOverlapCountBudgetTool.execute;
export default speakerTurnOverlapCountBudgetTool;
