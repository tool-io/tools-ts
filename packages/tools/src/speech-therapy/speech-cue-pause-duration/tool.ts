import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cueEndSeconds: number;
  readonly responseStartSeconds: number;
};
export type Output = {
  readonly signedPauseSeconds: number;
  readonly overlap: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cueEndSeconds: { type: "number" },
    responseStartSeconds: { type: "number" },
  },
  required: ["cueEndSeconds", "responseStartSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedPauseSeconds: { type: "number" },
    overlap: { type: "boolean" },
  },
  required: ["signedPauseSeconds", "overlap"],
} as const;
/** Compare explicit cue and response markers without determining an appropriate speech pause. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cueEndSeconds, responseStartSeconds } = request;
  const compute = (): Output => {
    return {
      signedPauseSeconds: responseStartSeconds - cueEndSeconds,
      overlap: responseStartSeconds < cueEndSeconds,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { cueEndSeconds: 2, responseStartSeconds: 2.75 },
  output: { signedPauseSeconds: 0.75, overlap: false },
} satisfies ToolExample<Input, Output>;
export const speechCuePauseDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["speech-therapy", "speech therapy", "health and medicine"],
      keywords: ["speech therapy", "health and medicine"],
    },
    id: "speech-therapy/speech-cue-pause-duration",
    title: "Speech Cue Pause Duration",
    description:
      "Compare explicit cue and response markers without determining an appropriate speech pause.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cueEndSeconds: { type: "number" },
        responseStartSeconds: { type: "number" },
      },
      required: ["cueEndSeconds", "responseStartSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedPauseSeconds: { type: "number" },
        overlap: { type: "boolean" },
      },
      required: ["signedPauseSeconds", "overlap"],
    },
    ports: {
      inputs: [
        {
          id: "cueEndSeconds",
          label: "Cue End Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "responseStartSeconds",
          label: "Response Start Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedPauseSeconds",
          label: "Signed Pause Seconds",
          valueType: { type: "number" },
        },
        { id: "overlap", label: "Overlap", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = speechCuePauseDurationTool.execute;
export default speechCuePauseDurationTool;
