import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstSignal: number;
  readonly secondSignal: number;
  readonly firstThreshold: number;
  readonly secondThreshold: number;
  readonly equalityPositive: boolean;
};
export type Output = {
  readonly firstPositive: boolean;
  readonly secondPositive: boolean;
  readonly quadrant: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstSignal: { type: "number" },
    secondSignal: { type: "number" },
    firstThreshold: { type: "number" },
    secondThreshold: { type: "number" },
    equalityPositive: { type: "boolean" },
  },
  required: [
    "firstSignal",
    "secondSignal",
    "firstThreshold",
    "secondThreshold",
    "equalityPositive",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstPositive: { type: "boolean" },
    secondPositive: { type: "boolean" },
    quadrant: { type: "string", maxLength: 8192 },
  },
  required: ["firstPositive", "secondPositive", "quadrant"],
} as const;
/** Two supplied threshold gate flags with an explicit equality policy, without marker-specific positivity thresholds. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    firstSignal,
    secondSignal,
    firstThreshold,
    secondThreshold,
    equalityPositive,
  } = request;
  const compute = (): Output => {
    return {
      firstPositive: equalityPositive
        ? firstSignal >= firstThreshold
        : firstSignal > firstThreshold,
      secondPositive: equalityPositive
        ? secondSignal >= secondThreshold
        : secondSignal > secondThreshold,
      quadrant: (
        equalityPositive
          ? firstSignal >= firstThreshold
          : firstSignal > firstThreshold
      )
        ? (
            equalityPositive
              ? secondSignal >= secondThreshold
              : secondSignal > secondThreshold
          )
          ? "double-positive"
          : "first-only"
        : (
              equalityPositive
                ? secondSignal >= secondThreshold
                : secondSignal > secondThreshold
            )
          ? "second-only"
          : "double-negative",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstSignal: 10,
    secondSignal: 5,
    firstThreshold: 8,
    secondThreshold: 5,
    equalityPositive: true,
  },
  output: {
    firstPositive: true,
    secondPositive: true,
    quadrant: "double-positive",
  },
} satisfies ToolExample<Input, Output>;
export const flowGateBooleanTwoChannelMembershipTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "immunology/flow-gate-boolean-two-channel-membership",
      title: "Flow Gate Boolean Two Channel Membership Tool",
      description:
        "Two supplied threshold gate flags with an explicit equality policy, without marker-specific positivity thresholds.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstSignal: { type: "number" },
          secondSignal: { type: "number" },
          firstThreshold: { type: "number" },
          secondThreshold: { type: "number" },
          equalityPositive: { type: "boolean" },
        },
        required: [
          "firstSignal",
          "secondSignal",
          "firstThreshold",
          "secondThreshold",
          "equalityPositive",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstPositive: { type: "boolean" },
          secondPositive: { type: "boolean" },
          quadrant: { type: "string", maxLength: 8192 },
        },
        required: ["firstPositive", "secondPositive", "quadrant"],
      },
      ports: {
        inputs: [
          {
            id: "firstSignal",
            label: "First Signal",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondSignal",
            label: "Second Signal",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "firstThreshold",
            label: "First Threshold",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondThreshold",
            label: "Second Threshold",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "equalityPositive",
            label: "Equality Positive",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "firstPositive",
            label: "First Positive",
            valueType: { type: "boolean" },
          },
          {
            id: "secondPositive",
            label: "Second Positive",
            valueType: { type: "boolean" },
          },
          { id: "quadrant", label: "Quadrant", valueType: { type: "string" } },
        ],
      },
    },
    calculate,
  });
export const run = flowGateBooleanTwoChannelMembershipTool.execute;
export default flowGateBooleanTwoChannelMembershipTool;
