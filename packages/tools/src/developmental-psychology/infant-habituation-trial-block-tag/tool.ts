import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sessionId: string;
  readonly trialId: string;
  readonly suppliedBlock: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sessionId: { type: "string", maxLength: 8192, minLength: 1 },
    trialId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedBlock: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sessionId", "trialId", "suppliedBlock"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicitly assigned infant-study trial block without classifying behavioral habituation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sessionId, trialId, suppliedBlock } = request;
  const compute = (): Output => {
    H.domain(sessionId.length > 0, "sessionId");
    H.domain(trialId.length > 0, "trialId");
    H.domain(suppliedBlock.length > 0, "suppliedBlock");
    return { token: JSON.stringify([sessionId, trialId, suppliedBlock]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sessionId: "S17", trialId: "T4", suppliedBlock: "habituation" },
  output: { token: '["S17","T4","habituation"]' },
} satisfies ToolExample<Input, Output>;
export const infantHabituationTrialBlockTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "developmental-psychology/infant-habituation-trial-block-tag",
    title: "Infant Habituation Trial Block Tag Tool",
    description:
      "Preserve an explicitly assigned infant-study trial block without classifying behavioral habituation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sessionId: { type: "string", maxLength: 8192, minLength: 1 },
        trialId: { type: "string", maxLength: 8192, minLength: 1 },
        suppliedBlock: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["sessionId", "trialId", "suppliedBlock"],
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
          id: "sessionId",
          label: "Session Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "trialId",
          label: "Trial Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedBlock",
          label: "Supplied Block",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = infantHabituationTrialBlockTagTool.execute;
export default infantHabituationTrialBlockTagTool;
