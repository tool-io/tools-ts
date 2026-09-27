import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly allWeights: readonly number[];
  readonly playerIndex: number;
  readonly quota: number;
};
export type Output = {
  readonly withoutPlayer: number;
  readonly isVeto: boolean;
  readonly winningGrandCoalition: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allWeights: { type: "array", maxItems: 256, items: { type: "number" } },
    playerIndex: { type: "integer", minimum: 0 },
    quota: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["allWeights", "playerIndex", "quota"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    withoutPlayer: { type: "number" },
    isVeto: { type: "boolean" },
    winningGrandCoalition: { type: "boolean" },
  },
  required: ["withoutPlayer", "isVeto", "winningGrandCoalition"],
} as const;
/** Veto-player condition for a supplied nonnegative weighted voting game. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { allWeights, playerIndex, quota } = request;
  const compute = (): Output => {
    H.domain(
      allWeights.length > 0 && allWeights.every((x) => x >= 0) && quota > 0,
    );
    H.integer(playerIndex, 0, allWeights.length - 1);
    return {
      withoutPlayer:
        allWeights.reduce((a, b) => a + b, 0) - allWeights[playerIndex],
      isVeto:
        allWeights.reduce((a, b) => a + b, 0) >= quota &&
        allWeights.reduce((a, b) => a + b, 0) - allWeights[playerIndex] < quota,
      winningGrandCoalition: allWeights.reduce((a, b) => a + b, 0) >= quota,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { allWeights: [6, 3, 1], playerIndex: 0, quota: 7 },
  output: { withoutPlayer: 4, isVeto: true, winningGrandCoalition: true },
} satisfies ToolExample<Input, Output>;
export const coalitionVetoPlayerBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "game-theory/coalition-veto-player-budget",
    title: "Coalition Veto Player Budget Tool",
    description:
      "Veto-player condition for a supplied nonnegative weighted voting game.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        allWeights: { type: "array", maxItems: 256, items: { type: "number" } },
        playerIndex: { type: "integer", minimum: 0 },
        quota: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["allWeights", "playerIndex", "quota"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        withoutPlayer: { type: "number" },
        isVeto: { type: "boolean" },
        winningGrandCoalition: { type: "boolean" },
      },
      required: ["withoutPlayer", "isVeto", "winningGrandCoalition"],
    },
    ports: {
      inputs: [
        {
          id: "allWeights",
          label: "All Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "playerIndex",
          label: "Player Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "quota",
          label: "Quota",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "withoutPlayer",
          label: "Without Player",
          valueType: { type: "number" },
        },
        { id: "isVeto", label: "Is Veto", valueType: { type: "boolean" } },
        {
          id: "winningGrandCoalition",
          label: "Winning Grand Coalition",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = coalitionVetoPlayerBudgetTool.execute;
export default coalitionVetoPlayerBudgetTool;
