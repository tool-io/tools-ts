import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly durations: readonly number[];
  readonly audioPresent: readonly boolean[];
  readonly captionPresent: readonly boolean[];
};
export type Output = {
  readonly audioDuration: number;
  readonly captionedAudioDuration: number;
  readonly unsupportedAudioDuration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    durations: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    audioPresent: { type: "array", maxItems: 256, items: { type: "boolean" } },
    captionPresent: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: ["durations", "audioPresent", "captionPresent"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    audioDuration: { type: "number" },
    captionedAudioDuration: { type: "number" },
    unsupportedAudioDuration: { type: "number" },
  },
  required: [
    "audioDuration",
    "captionedAudioDuration",
    "unsupportedAudioDuration",
  ],
} as const;
/** Measure explicit temporal audio/caption support, without judging caption quality or compliance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { durations, audioPresent, captionPresent } = request;
  const compute = (): Output => {
    H.sameLength(durations, audioPresent);
    H.sameLength(durations, captionPresent);
    H.domain(durations.every((x) => x >= 0));
    return (() => {
      const audioDuration = durations.reduce(
          (s, x, i) => s + (audioPresent[i] ? x : 0),
          0,
        ),
        captionedAudioDuration = durations.reduce(
          (s, x, i) => s + (audioPresent[i] && captionPresent[i] ? x : 0),
          0,
        );
      return {
        audioDuration,
        captionedAudioDuration,
        unsupportedAudioDuration: audioDuration - captionedAudioDuration,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    durations: [2, 3, 5],
    audioPresent: [true, true, false],
    captionPresent: [true, false, true],
  },
  output: {
    audioDuration: 5,
    captionedAudioDuration: 2,
    unsupportedAudioDuration: 3,
  },
} satisfies ToolExample<Input, Output>;
export const captionAudioSupportGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "disability-studies/caption-audio-support-gap",
    title: "Caption Audio Support Gap Tool",
    description:
      "Measure explicit temporal audio/caption support, without judging caption quality or compliance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        durations: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        audioPresent: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        captionPresent: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["durations", "audioPresent", "captionPresent"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        audioDuration: { type: "number" },
        captionedAudioDuration: { type: "number" },
        unsupportedAudioDuration: { type: "number" },
      },
      required: [
        "audioDuration",
        "captionedAudioDuration",
        "unsupportedAudioDuration",
      ],
    },
    ports: {
      inputs: [
        {
          id: "durations",
          label: "Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "audioPresent",
          label: "Audio Present",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "captionPresent",
          label: "Caption Present",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "audioDuration",
          label: "Audio Duration",
          valueType: { type: "number" },
        },
        {
          id: "captionedAudioDuration",
          label: "Captioned Audio Duration",
          valueType: { type: "number" },
        },
        {
          id: "unsupportedAudioDuration",
          label: "Unsupported Audio Duration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = captionAudioSupportGapTool.execute;
export default captionAudioSupportGapTool;
