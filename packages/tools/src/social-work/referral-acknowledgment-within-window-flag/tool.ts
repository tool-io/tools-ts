import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referralSeconds: number;
  readonly acknowledgmentSeconds: number;
  readonly suppliedWindowSeconds: number;
};
export type Output = {
  readonly responseDelaySeconds: number;
  readonly withinSuppliedWindow: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referralSeconds: { type: "number" },
    acknowledgmentSeconds: { type: "number" },
    suppliedWindowSeconds: { type: "number", minimum: 0 },
  },
  required: [
    "referralSeconds",
    "acknowledgmentSeconds",
    "suppliedWindowSeconds",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    responseDelaySeconds: { type: "number" },
    withinSuppliedWindow: { type: "boolean" },
  },
  required: ["responseDelaySeconds", "withinSuppliedWindow"],
} as const;
/** Compare explicit referral acknowledgment markers with a supplied response window without determining care adequacy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referralSeconds, acknowledgmentSeconds, suppliedWindowSeconds } =
    request;
  const compute = (): Output => {
    H.domain(suppliedWindowSeconds >= 0, "suppliedWindowSeconds");
    return {
      responseDelaySeconds: acknowledgmentSeconds - referralSeconds,
      withinSuppliedWindow:
        acknowledgmentSeconds >= referralSeconds &&
        acknowledgmentSeconds - referralSeconds <= suppliedWindowSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    referralSeconds: 100,
    acknowledgmentSeconds: 130,
    suppliedWindowSeconds: 60,
  },
  output: { responseDelaySeconds: 30, withinSuppliedWindow: true },
} satisfies ToolExample<Input, Output>;
export const referralAcknowledgmentWithinWindowFlagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["social-work", "social work", "social sciences"],
        keywords: ["social work", "social sciences"],
      },
      id: "social-work/referral-acknowledgment-within-window-flag",
      title: "Referral Acknowledgment Within Window Flag",
      description:
        "Compare explicit referral acknowledgment markers with a supplied response window without determining care adequacy.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          referralSeconds: { type: "number" },
          acknowledgmentSeconds: { type: "number" },
          suppliedWindowSeconds: { type: "number", minimum: 0 },
        },
        required: [
          "referralSeconds",
          "acknowledgmentSeconds",
          "suppliedWindowSeconds",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          responseDelaySeconds: { type: "number" },
          withinSuppliedWindow: { type: "boolean" },
        },
        required: ["responseDelaySeconds", "withinSuppliedWindow"],
      },
      ports: {
        inputs: [
          {
            id: "referralSeconds",
            label: "Referral Seconds",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "acknowledgmentSeconds",
            label: "Acknowledgment Seconds",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedWindowSeconds",
            label: "Supplied Window Seconds",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "responseDelaySeconds",
            label: "Response Delay Seconds",
            valueType: { type: "number" },
          },
          {
            id: "withinSuppliedWindow",
            label: "Within Supplied Window",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = referralAcknowledgmentWithinWindowFlagTool.execute;
export default referralAcknowledgmentWithinWindowFlagTool;
