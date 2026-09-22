import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly proxyApproved: boolean;
  readonly participantAssents: boolean;
  readonly participantDeclines: boolean;
  readonly suppliedDeclineOverrides: boolean;
};
export type Output = {
  readonly contradictoryParticipantFlags: boolean;
  readonly blockedUnderPolicy: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    proxyApproved: { type: "boolean" },
    participantAssents: { type: "boolean" },
    participantDeclines: { type: "boolean" },
    suppliedDeclineOverrides: { type: "boolean" },
  },
  required: [
    "proxyApproved",
    "participantAssents",
    "participantDeclines",
    "suppliedDeclineOverrides",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contradictoryParticipantFlags: { type: "boolean" },
    blockedUnderPolicy: { type: "boolean" },
  },
  required: ["contradictoryParticipantFlags", "blockedUnderPolicy"],
} as const;
/** Expose inconsistent supplied assent flags and evaluate an explicit override policy; no consent authority is determined. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    proxyApproved,
    participantAssents,
    participantDeclines,
    suppliedDeclineOverrides,
  } = request;
  const compute = (): Output => {
    return {
      contradictoryParticipantFlags: participantAssents && participantDeclines,
      blockedUnderPolicy:
        (participantAssents && participantDeclines) ||
        !proxyApproved ||
        (suppliedDeclineOverrides && participantDeclines),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    proxyApproved: true,
    participantAssents: true,
    participantDeclines: true,
    suppliedDeclineOverrides: true,
  },
  output: { contradictoryParticipantFlags: true, blockedUnderPolicy: true },
} satisfies ToolExample<Input, Output>;
export const proxyAssentRoleConflictTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioethics/proxy-assent-role-conflict",
    title: "Proxy Assent Role Conflict Tool",
    description:
      "Expose inconsistent supplied assent flags and evaluate an explicit override policy; no consent authority is determined.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        proxyApproved: { type: "boolean" },
        participantAssents: { type: "boolean" },
        participantDeclines: { type: "boolean" },
        suppliedDeclineOverrides: { type: "boolean" },
      },
      required: [
        "proxyApproved",
        "participantAssents",
        "participantDeclines",
        "suppliedDeclineOverrides",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        contradictoryParticipantFlags: { type: "boolean" },
        blockedUnderPolicy: { type: "boolean" },
      },
      required: ["contradictoryParticipantFlags", "blockedUnderPolicy"],
    },
    ports: {
      inputs: [
        {
          id: "proxyApproved",
          label: "Proxy Approved",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "participantAssents",
          label: "Participant Assents",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "participantDeclines",
          label: "Participant Declines",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "suppliedDeclineOverrides",
          label: "Supplied Decline Overrides",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "contradictoryParticipantFlags",
          label: "Contradictory Participant Flags",
          valueType: { type: "boolean" },
        },
        {
          id: "blockedUnderPolicy",
          label: "Blocked Under Policy",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = proxyAssentRoleConflictTool.execute;
export default proxyAssentRoleConflictTool;
