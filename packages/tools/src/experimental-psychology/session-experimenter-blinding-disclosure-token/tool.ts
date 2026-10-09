import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sessionId: string;
  readonly experimenterId: string;
  readonly suppliedBlindingStatus: string;
};
export type Output = { readonly token: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sessionId: { type: "string", maxLength: 8192, minLength: 1 },
    experimenterId: { type: "string", maxLength: 8192, minLength: 1 },
    suppliedBlindingStatus: { type: "string", maxLength: 8192, minLength: 1 },
  },
  required: ["sessionId", "experimenterId", "suppliedBlindingStatus"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { token: { type: "string", maxLength: 8192 } },
  required: ["token"],
} as const;
/** Preserve an explicitly reported session experimenter blinding status without verifying concealment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sessionId, experimenterId, suppliedBlindingStatus } = request;
  const compute = (): Output => {
    H.domain(sessionId.length > 0, "sessionId");
    H.domain(experimenterId.length > 0, "experimenterId");
    H.domain(suppliedBlindingStatus.length > 0, "suppliedBlindingStatus");
    return {
      token: JSON.stringify([
        sessionId,
        experimenterId,
        suppliedBlindingStatus,
      ]),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sessionId: "S17",
    experimenterId: "E4",
    suppliedBlindingStatus: "blinded",
  },
  output: { token: '["S17","E4","blinded"]' },
} satisfies ToolExample<Input, Output>;
export const sessionExperimenterBlindingDisclosureTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "experimental-psychology/session-experimenter-blinding-disclosure-token",
      title: "Session Experimenter Blinding Disclosure Token Tool",
      description:
        "Preserve an explicitly reported session experimenter blinding status without verifying concealment.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sessionId: { type: "string", maxLength: 8192, minLength: 1 },
          experimenterId: { type: "string", maxLength: 8192, minLength: 1 },
          suppliedBlindingStatus: {
            type: "string",
            maxLength: 8192,
            minLength: 1,
          },
        },
        required: ["sessionId", "experimenterId", "suppliedBlindingStatus"],
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
            id: "experimenterId",
            label: "Experimenter Id",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "suppliedBlindingStatus",
            label: "Supplied Blinding Status",
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
  });
export const run = sessionExperimenterBlindingDisclosureTokenTool.execute;
export default sessionExperimenterBlindingDisclosureTokenTool;
