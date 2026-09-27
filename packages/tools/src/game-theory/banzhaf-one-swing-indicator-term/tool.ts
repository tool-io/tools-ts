import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coalitionWeight: number;
  readonly playerWeight: number;
  readonly quota: number;
};
export type Output = {
  readonly withoutWins: boolean;
  readonly withWins: boolean;
  readonly swing: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coalitionWeight: { type: "number", minimum: 0 },
    playerWeight: { type: "number", minimum: 0 },
    quota: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["coalitionWeight", "playerWeight", "quota"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    withoutWins: { type: "boolean" },
    withWins: { type: "boolean" },
    swing: { type: "boolean" },
  },
  required: ["withoutWins", "withWins", "swing"],
} as const;
/** Calculate banzhaf one swing indicator term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coalitionWeight, playerWeight, quota } = request;
  const compute = (): Output => {
    H.domain(coalitionWeight >= 0 && playerWeight >= 0);
    H.positive(quota);
    return {
      withoutWins: coalitionWeight >= quota,
      withWins: coalitionWeight + playerWeight >= quota,
      swing: coalitionWeight < quota && coalitionWeight + playerWeight >= quota,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coalitionWeight: 4, playerWeight: 3, quota: 6 },
  output: { withoutWins: false, withWins: true, swing: true },
} satisfies ToolExample<Input, Output>;
export const banzhafOneSwingIndicatorTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "game-theory/banzhaf-one-swing-indicator-term",
    title: "Banzhaf One Swing Indicator Term Tool",
    description:
      "Calculate banzhaf one swing indicator term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coalitionWeight: { type: "number", minimum: 0 },
        playerWeight: { type: "number", minimum: 0 },
        quota: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["coalitionWeight", "playerWeight", "quota"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        withoutWins: { type: "boolean" },
        withWins: { type: "boolean" },
        swing: { type: "boolean" },
      },
      required: ["withoutWins", "withWins", "swing"],
    },
    ports: {
      inputs: [
        {
          id: "coalitionWeight",
          label: "Coalition Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "playerWeight",
          label: "Player Weight",
          required: true,
          valueType: { type: "number" },
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
          id: "withoutWins",
          label: "Without Wins",
          valueType: { type: "boolean" },
        },
        { id: "withWins", label: "With Wins", valueType: { type: "boolean" } },
        { id: "swing", label: "Swing", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = banzhafOneSwingIndicatorTermTool.execute;
export default banzhafOneSwingIndicatorTermTool;
