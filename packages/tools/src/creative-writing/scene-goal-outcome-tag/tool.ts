import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sceneId: string;
  readonly goalText: string;
  readonly outcomeCode: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sceneId: { type: "string", maxLength: 8192, minLength: 1 },
    goalText: { type: "string", maxLength: 8192, minLength: 1 },
    outcomeCode: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sceneId", "goalText", "outcomeCode"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Record a scene goal and its explicitly supplied outcome code without evaluating narrative quality. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sceneId, goalText, outcomeCode } = request;
  const compute = (): Output => {
    H.domain(sceneId.length > 0, "sceneId");
    H.domain(goalText.length > 0, "goalText");
    H.domain(outcomeCode.length > 0, "outcomeCode");
    return { token: JSON.stringify([sceneId, goalText, outcomeCode]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sceneId: "S17", goalText: "find the key", outcomeCode: "partial" },
  output: { token: '["S17","find the key","partial"]' },
} satisfies ToolExample<Input, Output>;
export const sceneGoalOutcomeTagTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["creative-writing", "creative writing", "humanities"],
        keywords: ["creative writing", "humanities"],
      },
      id: "creative-writing/scene-goal-outcome-tag",
      title: "Scene Goal Outcome Tag",
      description:
        "Record a scene goal and its explicitly supplied outcome code without evaluating narrative quality.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sceneId: { type: "string", maxLength: 8192, minLength: 1 },
          goalText: { type: "string", maxLength: 8192, minLength: 1 },
          outcomeCode: { type: "string", maxLength: 8192, minLength: 1 },
        },
        required: ["sceneId", "goalText", "outcomeCode"],
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
            id: "sceneId",
            label: "Scene Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "goalText",
            label: "Goal Text",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "outcomeCode",
            label: "Outcome Code",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          { id: "token", label: "Token", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  },
);
export const run = sceneGoalOutcomeTagTool.execute;
export default sceneGoalOutcomeTagTool;
