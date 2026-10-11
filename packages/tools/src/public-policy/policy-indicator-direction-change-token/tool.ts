import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousValue: number;
  readonly currentValue: number;
  readonly higherPreferred: boolean;
};
export type Output = {
  readonly signedChange: number;
  readonly preferredDirectionChange: boolean;
  readonly unchanged: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousValue: { type: "number" },
    currentValue: { type: "number" },
    higherPreferred: { type: "boolean" },
  },
  required: ["previousValue", "currentValue", "higherPreferred"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedChange: { type: "number" },
    preferredDirectionChange: { type: "boolean" },
    unchanged: { type: "boolean" },
  },
  required: ["signedChange", "preferredDirectionChange", "unchanged"],
} as const;
/** Compare explicit indicator observations under a supplied preferred direction without attributing change to a policy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousValue, currentValue, higherPreferred } = request;
  const compute = (): Output => {
    return {
      signedChange: currentValue - previousValue,
      preferredDirectionChange: higherPreferred
        ? currentValue > previousValue
        : currentValue < previousValue,
      unchanged: currentValue === previousValue,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousValue: 40, currentValue: 35, higherPreferred: false },
  output: {
    signedChange: -5,
    preferredDirectionChange: true,
    unchanged: false,
  },
} satisfies ToolExample<Input, Output>;
export const policyIndicatorDirectionChangeTokenTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["learn"],
        fields: ["public-policy", "public policy", "social sciences"],
        keywords: ["public policy", "social sciences"],
      },
      id: "public-policy/policy-indicator-direction-change-token",
      title: "Policy Indicator Direction Change Token",
      description:
        "Compare explicit indicator observations under a supplied preferred direction without attributing change to a policy.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          previousValue: { type: "number" },
          currentValue: { type: "number" },
          higherPreferred: { type: "boolean" },
        },
        required: ["previousValue", "currentValue", "higherPreferred"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          signedChange: { type: "number" },
          preferredDirectionChange: { type: "boolean" },
          unchanged: { type: "boolean" },
        },
        required: ["signedChange", "preferredDirectionChange", "unchanged"],
      },
      ports: {
        inputs: [
          {
            id: "previousValue",
            label: "Previous Value",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "currentValue",
            label: "Current Value",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "higherPreferred",
            label: "Higher Preferred",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "signedChange",
            label: "Signed Change",
            valueType: { type: "number" },
          },
          {
            id: "preferredDirectionChange",
            label: "Preferred Direction Change",
            valueType: { type: "boolean" },
          },
          {
            id: "unchanged",
            label: "Unchanged",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = policyIndicatorDirectionChangeTokenTool.execute;
export default policyIndicatorDirectionChangeTokenTool;
