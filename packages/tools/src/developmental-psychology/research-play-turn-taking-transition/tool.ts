import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousSpeakerId: string;
  readonly currentSpeakerId: string;
};
export type Output = {
  readonly speakerChanged: boolean;
  readonly transitionKey: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousSpeakerId: { type: "string", maxLength: 8192, minLength: 1 },
    currentSpeakerId: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["previousSpeakerId", "currentSpeakerId"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    speakerChanged: { type: "boolean" },
    transitionKey: { type: "string", maxLength: 8192 },
  },
  required: ["speakerChanged", "transitionKey"],
} as const;
/** Record one explicit speaker transition in research play without inferring social or developmental ability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousSpeakerId, currentSpeakerId } = request;
  const compute = (): Output => {
    H.domain(previousSpeakerId.length > 0, "previousSpeakerId");
    H.domain(currentSpeakerId.length > 0, "currentSpeakerId");
    return {
      speakerChanged: previousSpeakerId !== currentSpeakerId,
      transitionKey: JSON.stringify([previousSpeakerId, currentSpeakerId]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousSpeakerId: "A", currentSpeakerId: "B" },
  output: { speakerChanged: true, transitionKey: '["A","B"]' },
} satisfies ToolExample<Input, Output>;
export const researchPlayTurnTakingTransitionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-psychology/research-play-turn-taking-transition",
    title: "Research Play Turn Taking Transition Tool",
    description:
      "Record one explicit speaker transition in research play without inferring social or developmental ability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousSpeakerId: { type: "string", maxLength: 8192, minLength: 1 },
        currentSpeakerId: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["previousSpeakerId", "currentSpeakerId"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        speakerChanged: { type: "boolean" },
        transitionKey: { type: "string", maxLength: 8192 },
      },
      required: ["speakerChanged", "transitionKey"],
    },
    ports: {
      inputs: [
        {
          id: "previousSpeakerId",
          label: "Previous Speaker Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "currentSpeakerId",
          label: "Current Speaker Id",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "speakerChanged",
          label: "Speaker Changed",
          valueType: { type: "boolean" },
        },
        {
          id: "transitionKey",
          label: "Transition Key",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = researchPlayTurnTakingTransitionTool.execute;
export default researchPlayTurnTakingTransitionTool;
