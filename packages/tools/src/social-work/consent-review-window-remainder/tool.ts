import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly reviewDue: number;
  readonly currentTime: number;
  readonly suppliedExtension: number;
  readonly extensionAuthorized: boolean;
};
export type Output = {
  readonly remaining: number;
  readonly effectiveDue: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reviewDue: { type: "number" },
    currentTime: { type: "number" },
    suppliedExtension: { type: "number", minimum: 0 },
    extensionAuthorized: { type: "boolean" },
  },
  required: [
    "reviewDue",
    "currentTime",
    "suppliedExtension",
    "extensionAuthorized",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remaining: { type: "number" },
    effectiveDue: { type: "number" },
  },
  required: ["remaining", "effectiveDue"],
} as const;
/** Track supplied consent-review scheduling metadata without deciding consent validity or extension authority. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reviewDue, currentTime, suppliedExtension, extensionAuthorized } =
    request;
  const compute = (): Output => {
    H.domain(suppliedExtension >= 0);
    return {
      remaining:
        reviewDue + (extensionAuthorized ? suppliedExtension : 0) - currentTime,
      effectiveDue: reviewDue + (extensionAuthorized ? suppliedExtension : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    reviewDue: 100,
    currentTime: 90,
    suppliedExtension: 5,
    extensionAuthorized: true,
  },
  output: { remaining: 15, effectiveDue: 105 },
} satisfies ToolExample<Input, Output>;
export const consentReviewWindowRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "social-work/consent-review-window-remainder",
    title: "Consent Review Window Remainder Tool",
    description:
      "Track supplied consent-review scheduling metadata without deciding consent validity or extension authority.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reviewDue: { type: "number" },
        currentTime: { type: "number" },
        suppliedExtension: { type: "number", minimum: 0 },
        extensionAuthorized: { type: "boolean" },
      },
      required: [
        "reviewDue",
        "currentTime",
        "suppliedExtension",
        "extensionAuthorized",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        remaining: { type: "number" },
        effectiveDue: { type: "number" },
      },
      required: ["remaining", "effectiveDue"],
    },
    ports: {
      inputs: [
        {
          id: "reviewDue",
          label: "Review Due",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "currentTime",
          label: "Current Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedExtension",
          label: "Supplied Extension",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "extensionAuthorized",
          label: "Extension Authorized",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "remaining", label: "Remaining", valueType: { type: "number" } },
        {
          id: "effectiveDue",
          label: "Effective Due",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = consentReviewWindowRemainderTool.execute;
export default consentReviewWindowRemainderTool;
