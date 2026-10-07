import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sessionId: string;
  readonly sourceStage: string;
  readonly relayStage: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sessionId: { type: "string", maxLength: 8192, minLength: 1 },
    sourceStage: { type: "string", maxLength: 8192, minLength: 1 },
    relayStage: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sessionId", "sourceStage", "relayStage"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Qualify explicit interpreting relay stage labels without evaluating interpreting quality. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sessionId, sourceStage, relayStage } = request;
  const compute = (): Output => {
    H.domain(sessionId.length > 0, "sessionId");
    H.domain(sourceStage.length > 0, "sourceStage");
    H.domain(relayStage.length > 0, "relayStage");
    return { token: JSON.stringify([sessionId, sourceStage, relayStage]) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sessionId: "S17", sourceStage: "Speaker A", relayStage: "Relay B" },
  output: { token: '["S17","Speaker A","Relay B"]' },
} satisfies ToolExample<Input, Output>;
export const signInterpretingRelayStageLabelTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["communication", "social sciences"],
      keywords: ["communication", "social sciences"],
    },
    id: "communication/sign-interpreting-relay-stage-label",
    title: "Sign Interpreting Relay Stage Label",
    description:
      "Qualify explicit interpreting relay stage labels without evaluating interpreting quality.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sessionId: { type: "string", maxLength: 8192, minLength: 1 },
        sourceStage: { type: "string", maxLength: 8192, minLength: 1 },
        relayStage: { type: "string", maxLength: 8192, minLength: 1 },
      },
      required: ["sessionId", "sourceStage", "relayStage"],
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
          id: "sourceStage",
          label: "Source Stage",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "relayStage",
          label: "Relay Stage",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [{ id: "token", label: "Token", valueType: { type: "string" } }],
    },
  },
  calculate,
});
export const run = signInterpretingRelayStageLabelTool.execute;
export default signInterpretingRelayStageLabelTool;
