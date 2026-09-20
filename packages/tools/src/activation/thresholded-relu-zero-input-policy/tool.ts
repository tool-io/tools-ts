import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly threshold: number;
  readonly passAtThreshold: boolean;
};
export type Output = {
  readonly zeroPasses: boolean;
  readonly zeroOutput: number;
  readonly derivativeAtZero: number;
  readonly derivativeDefined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    threshold: { type: "number" },
    passAtThreshold: { type: "boolean" },
  },
  required: ["threshold", "passAtThreshold"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    zeroPasses: { type: "boolean" },
    zeroOutput: { type: "number" },
    derivativeAtZero: { type: "number" },
    derivativeDefined: { type: "boolean" },
  },
  required: [
    "zeroPasses",
    "zeroOutput",
    "derivativeAtZero",
    "derivativeDefined",
  ],
} as const;
/** Report strict/inclusive threshold membership and derivative availability, using zero as a placeholder when undefined. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { threshold, passAtThreshold } = request;
  const compute = (): Output => {
    return {
      zeroPasses: passAtThreshold ? 0 >= threshold : 0 > threshold,
      zeroOutput: 0,
      derivativeAtZero: threshold === 0 ? 0 : threshold < 0 ? 1 : 0,
      derivativeDefined: threshold !== 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { threshold: 0, passAtThreshold: false },
  output: {
    zeroPasses: false,
    zeroOutput: 0,
    derivativeAtZero: 0,
    derivativeDefined: false,
  },
} satisfies ToolExample<Input, Output>;
export const thresholdedReluZeroInputPolicyTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "activation/thresholded-relu-zero-input-policy",
    title: "Thresholded ReLU Zero Input Policy Tool",
    description:
      "Report strict/inclusive threshold membership and derivative availability, using zero as a placeholder when undefined.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        threshold: { type: "number" },
        passAtThreshold: { type: "boolean" },
      },
      required: ["threshold", "passAtThreshold"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        zeroPasses: { type: "boolean" },
        zeroOutput: { type: "number" },
        derivativeAtZero: { type: "number" },
        derivativeDefined: { type: "boolean" },
      },
      required: [
        "zeroPasses",
        "zeroOutput",
        "derivativeAtZero",
        "derivativeDefined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "threshold",
          label: "Threshold",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "passAtThreshold",
          label: "Pass At Threshold",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "zeroPasses",
          label: "Zero Passes",
          valueType: { type: "boolean" },
        },
        {
          id: "zeroOutput",
          label: "Zero Output",
          valueType: { type: "number" },
        },
        {
          id: "derivativeAtZero",
          label: "Derivative At Zero",
          valueType: { type: "number" },
        },
        {
          id: "derivativeDefined",
          label: "Derivative Defined",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = thresholdedReluZeroInputPolicyTool.execute;
export default thresholdedReluZeroInputPolicyTool;
