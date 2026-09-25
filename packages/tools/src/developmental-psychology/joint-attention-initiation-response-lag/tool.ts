import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initiationSeconds: number;
  readonly responseSeconds: number;
  readonly maximumLag: number;
};
export type Output = {
  readonly lagSeconds: number;
  readonly withinWindow: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initiationSeconds: { type: "number" },
    responseSeconds: { type: "number" },
    maximumLag: { type: "number", minimum: 0 },
  },
  required: ["initiationSeconds", "responseSeconds", "maximumLag"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lagSeconds: { type: "number" },
    withinWindow: { type: "boolean" },
  },
  required: ["lagSeconds", "withinWindow"],
} as const;
/** Caller-coded event timing and an explicit research response window; no attention state is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initiationSeconds, responseSeconds, maximumLag } = request;
  const compute = (): Output => {
    H.domain(maximumLag >= 0);
    return {
      lagSeconds: responseSeconds - initiationSeconds,
      withinWindow:
        responseSeconds >= initiationSeconds &&
        responseSeconds - initiationSeconds <= maximumLag,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { initiationSeconds: 10, responseSeconds: 11.5, maximumLag: 2 },
  output: { lagSeconds: 1.5, withinWindow: true },
} satisfies ToolExample<Input, Output>;
export const jointAttentionInitiationResponseLagTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "developmental-psychology/joint-attention-initiation-response-lag",
      title: "Joint Attention Initiation Response Lag Tool",
      description:
        "Caller-coded event timing and an explicit research response window; no attention state is inferred.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          initiationSeconds: { type: "number" },
          responseSeconds: { type: "number" },
          maximumLag: { type: "number", minimum: 0 },
        },
        required: ["initiationSeconds", "responseSeconds", "maximumLag"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          lagSeconds: { type: "number" },
          withinWindow: { type: "boolean" },
        },
        required: ["lagSeconds", "withinWindow"],
      },
      ports: {
        inputs: [
          {
            id: "initiationSeconds",
            label: "Initiation Seconds",
            required: true,
            valueType: { type: "number", unit: "s" },
          },
          {
            id: "responseSeconds",
            label: "Response Seconds",
            required: true,
            valueType: { type: "number", unit: "s" },
          },
          {
            id: "maximumLag",
            label: "Maximum Lag",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "lagSeconds",
            label: "Lag Seconds",
            valueType: { type: "number", unit: "s" },
          },
          {
            id: "withinWindow",
            label: "Within Window",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = jointAttentionInitiationResponseLagTool.execute;
export default jointAttentionInitiationResponseLagTool;
