import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly delegatedFrom: number;
  readonly delegatedUntil: number;
  readonly signedAt: number;
  readonly inclusiveEnd: boolean;
};
export type Output = {
  readonly inside: boolean;
  readonly startSlack: number;
  readonly endSlack: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    delegatedFrom: { type: "number" },
    delegatedUntil: { type: "number" },
    signedAt: { type: "number" },
    inclusiveEnd: { type: "boolean" },
  },
  required: ["delegatedFrom", "delegatedUntil", "signedAt", "inclusiveEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inside: { type: "boolean" },
    startSlack: { type: "number" },
    endSlack: { type: "number" },
  },
  required: ["inside", "startSlack", "endSlack"],
} as const;
/** Compare supplied delegation dates only; signature authenticity and legal authority are not inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { delegatedFrom, delegatedUntil, signedAt, inclusiveEnd } = request;
  const compute = (): Output => {
    H.domain(delegatedUntil >= delegatedFrom);
    return {
      inside:
        signedAt >= delegatedFrom &&
        (inclusiveEnd ? signedAt <= delegatedUntil : signedAt < delegatedUntil),
      startSlack: signedAt - delegatedFrom,
      endSlack: delegatedUntil - signedAt,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    delegatedFrom: 10,
    delegatedUntil: 20,
    signedAt: 20,
    inclusiveEnd: true,
  },
  output: { inside: true, startSlack: 10, endSlack: 0 },
} satisfies ToolExample<Input, Output>;
export const delegatedSignatureIntervalGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "administrative-science/delegated-signature-interval-gap",
    title: "Delegated Signature Interval Gap Tool",
    description:
      "Compare supplied delegation dates only; signature authenticity and legal authority are not inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        delegatedFrom: { type: "number" },
        delegatedUntil: { type: "number" },
        signedAt: { type: "number" },
        inclusiveEnd: { type: "boolean" },
      },
      required: ["delegatedFrom", "delegatedUntil", "signedAt", "inclusiveEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inside: { type: "boolean" },
        startSlack: { type: "number" },
        endSlack: { type: "number" },
      },
      required: ["inside", "startSlack", "endSlack"],
    },
    ports: {
      inputs: [
        {
          id: "delegatedFrom",
          label: "Delegated From",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "delegatedUntil",
          label: "Delegated Until",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "signedAt",
          label: "Signed At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "inclusiveEnd",
          label: "Inclusive End",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "inside", label: "Inside", valueType: { type: "boolean" } },
        {
          id: "startSlack",
          label: "Start Slack",
          valueType: { type: "number" },
        },
        { id: "endSlack", label: "End Slack", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = delegatedSignatureIntervalGapTool.execute;
export default delegatedSignatureIntervalGapTool;
