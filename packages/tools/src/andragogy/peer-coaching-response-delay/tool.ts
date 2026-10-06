import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requestMinute: number;
  readonly responseMinute: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requestMinute: { type: "number" },
    responseMinute: { type: "number" },
  },
  required: ["requestMinute", "responseMinute"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Calculate signed response minus request elapsed minutes for supplied peer-coaching timestamps. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requestMinute, responseMinute } = request;
  const compute = (): Output => {
    return { signedGap: responseMinute - requestMinute };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requestMinute: 12, responseMinute: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const peerCoachingResponseDelayTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["andragogy", "education"],
      keywords: ["andragogy", "education"],
    },
    id: "andragogy/peer-coaching-response-delay",
    title: "Peer Coaching Response Delay",
    description:
      "Calculate signed response minus request elapsed minutes for supplied peer-coaching timestamps.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requestMinute: { type: "number" },
        responseMinute: { type: "number" },
      },
      required: ["requestMinute", "responseMinute"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "requestMinute",
          label: "Request Minute",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "responseMinute",
          label: "Response Minute",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = peerCoachingResponseDelayTool.execute;
export default peerCoachingResponseDelayTool;
