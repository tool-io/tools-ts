import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly callSeconds: number;
  readonly responseSeconds: number;
};
export type Output = {
  readonly signedResponseSeconds: number;
  readonly precedesCall: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    callSeconds: { type: "number" },
    responseSeconds: { type: "number" },
  },
  required: ["callSeconds", "responseSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedResponseSeconds: { type: "number" },
    precedesCall: { type: "boolean" },
  },
  required: ["signedResponseSeconds", "precedesCall"],
} as const;
/** Compare explicit midwifery call and response timestamps without evaluating urgency or response adequacy. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { callSeconds, responseSeconds } = request;
  const compute = (): Output => {
    return {
      signedResponseSeconds: responseSeconds - callSeconds,
      precedesCall: responseSeconds < callSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { callSeconds: 100, responseSeconds: 160 },
  output: { signedResponseSeconds: 60, precedesCall: false },
} satisfies ToolExample<Input, Output>;
export const midwifeCallResponseTimeGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["midwifery", "health and medicine"],
      keywords: ["midwifery", "health and medicine"],
    },
    id: "midwifery/midwife-call-response-time-gap",
    title: "Midwife Call Response Time Gap",
    description:
      "Compare explicit midwifery call and response timestamps without evaluating urgency or response adequacy.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        callSeconds: { type: "number" },
        responseSeconds: { type: "number" },
      },
      required: ["callSeconds", "responseSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedResponseSeconds: { type: "number" },
        precedesCall: { type: "boolean" },
      },
      required: ["signedResponseSeconds", "precedesCall"],
    },
    ports: {
      inputs: [
        {
          id: "callSeconds",
          label: "Call Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "responseSeconds",
          label: "Response Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedResponseSeconds",
          label: "Signed Response Seconds",
          valueType: { type: "number" },
        },
        {
          id: "precedesCall",
          label: "Precedes Call",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = midwifeCallResponseTimeGapTool.execute;
export default midwifeCallResponseTimeGapTool;
