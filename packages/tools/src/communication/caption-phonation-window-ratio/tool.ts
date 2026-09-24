import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly captionStart: number;
  readonly captionEnd: number;
  readonly voiceStart: number;
  readonly voiceEnd: number;
};
export type Output = {
  readonly coveredDuration: number;
  readonly voiceCoverage: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    captionStart: { type: "number" },
    captionEnd: { type: "number" },
    voiceStart: { type: "number" },
    voiceEnd: { type: "number" },
  },
  required: ["captionStart", "captionEnd", "voiceStart", "voiceEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coveredDuration: { type: "number" },
    voiceCoverage: { type: "number" },
  },
  required: ["coveredDuration", "voiceCoverage"],
} as const;
/** Calculate caption phonation window ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { captionStart, captionEnd, voiceStart, voiceEnd } = request;
  const compute = (): Output => {
    H.domain(captionEnd >= captionStart && voiceEnd > voiceStart);
    return {
      coveredDuration: Math.max(
        0,
        Math.min(captionEnd, voiceEnd) - Math.max(captionStart, voiceStart),
      ),
      voiceCoverage:
        Math.max(
          0,
          Math.min(captionEnd, voiceEnd) - Math.max(captionStart, voiceStart),
        ) /
        (voiceEnd - voiceStart),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { captionStart: 0, captionEnd: 6, voiceStart: 2, voiceEnd: 10 },
  output: { coveredDuration: 4, voiceCoverage: 0.5 },
} satisfies ToolExample<Input, Output>;
export const captionPhonationWindowRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "communication/caption-phonation-window-ratio",
    title: "Caption Phonation Window Ratio Tool",
    description:
      "Calculate caption phonation window ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        captionStart: { type: "number" },
        captionEnd: { type: "number" },
        voiceStart: { type: "number" },
        voiceEnd: { type: "number" },
      },
      required: ["captionStart", "captionEnd", "voiceStart", "voiceEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coveredDuration: { type: "number" },
        voiceCoverage: { type: "number" },
      },
      required: ["coveredDuration", "voiceCoverage"],
    },
    ports: {
      inputs: [
        {
          id: "captionStart",
          label: "Caption Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "captionEnd",
          label: "Caption End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "voiceStart",
          label: "Voice Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "voiceEnd",
          label: "Voice End",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "coveredDuration",
          label: "Covered Duration",
          valueType: { type: "number" },
        },
        {
          id: "voiceCoverage",
          label: "Voice Coverage",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = captionPhonationWindowRatioTool.execute;
export default captionPhonationWindowRatioTool;
