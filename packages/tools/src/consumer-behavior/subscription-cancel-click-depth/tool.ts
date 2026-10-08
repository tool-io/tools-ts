import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly completedClicks: number;
  readonly requiredClicks: number;
};
export type Output = {
  readonly remainingClicks: number;
  readonly completeUnderCount: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    completedClicks: { type: "integer", minimum: 0 },
    requiredClicks: { type: "integer", minimum: 0 },
  },
  required: ["completedClicks", "requiredClicks"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remainingClicks: { type: "integer" },
    completeUnderCount: { type: "boolean" },
  },
  required: ["remainingClicks", "completeUnderCount"],
} as const;
/** Compare observed and required cancellation-path click counts without performing cancellation or inferring interface compliance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { completedClicks, requiredClicks } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(completedClicks) &&
        completedClicks >= 0 &&
        completedClicks <= Number.MAX_SAFE_INTEGER,
      "completedClicks",
    ),
      completedClicks);
    (H.domain(
      Number.isSafeInteger(requiredClicks) &&
        requiredClicks >= 0 &&
        requiredClicks <= Number.MAX_SAFE_INTEGER,
      "requiredClicks",
    ),
      requiredClicks);
    return {
      remainingClicks: Math.max(0, requiredClicks - completedClicks),
      completeUnderCount: completedClicks >= requiredClicks,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { completedClicks: 3, requiredClicks: 5 },
  output: { remainingClicks: 2, completeUnderCount: false },
} satisfies ToolExample<Input, Output>;
export const subscriptionCancelClickDepthTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "consumer-behavior",
        "consumer behavior",
        "business and finance",
      ],
      keywords: ["consumer behavior", "business and finance"],
    },
    id: "consumer-behavior/subscription-cancel-click-depth",
    title: "Subscription Cancel Click Depth",
    description:
      "Compare observed and required cancellation-path click counts without performing cancellation or inferring interface compliance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        completedClicks: { type: "integer", minimum: 0 },
        requiredClicks: { type: "integer", minimum: 0 },
      },
      required: ["completedClicks", "requiredClicks"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remainingClicks: { type: "integer" },
        completeUnderCount: { type: "boolean" },
      },
      required: ["remainingClicks", "completeUnderCount"],
    },
    ports: {
      inputs: [
        {
          id: "completedClicks",
          label: "Completed Clicks",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "requiredClicks",
          label: "Required Clicks",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "remainingClicks",
          label: "Remaining Clicks",
          valueType: { type: "integer" },
        },
        {
          id: "completeUnderCount",
          label: "Complete Under Count",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = subscriptionCancelClickDepthTool.execute;
export default subscriptionCancelClickDepthTool;
