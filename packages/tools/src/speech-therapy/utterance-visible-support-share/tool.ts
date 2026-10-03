import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly utteranceDurations: readonly number[];
  readonly audioValid: readonly boolean[];
  readonly transcriptPresent: readonly boolean[];
  readonly articulationVisible: readonly boolean[];
};
export type Output = {
  readonly validAudioDuration: number;
  readonly jointSupportDuration: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    utteranceDurations: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    audioValid: { type: "array", maxItems: 256, items: { type: "boolean" } },
    transcriptPresent: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    articulationVisible: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: [
    "utteranceDurations",
    "audioValid",
    "transcriptPresent",
    "articulationVisible",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    validAudioDuration: { type: "number" },
    jointSupportDuration: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["validAudioDuration", "jointSupportDuration", "share", "defined"],
} as const;
/** Calculate utterance visible support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    utteranceDurations,
    audioValid,
    transcriptPresent,
    articulationVisible,
  } = request;
  const compute = (): Output => {
    H.sameLength(utteranceDurations, audioValid);
    H.sameLength(utteranceDurations, transcriptPresent);
    H.sameLength(utteranceDurations, articulationVisible);
    H.domain(utteranceDurations.every((x) => x >= 0));
    return (() => {
      const validAudioDuration = utteranceDurations.reduce(
          (s, x, i) => s + (audioValid[i] ? x : 0),
          0,
        ),
        jointSupportDuration = utteranceDurations.reduce(
          (s, x, i) =>
            s +
            (audioValid[i] && transcriptPresent[i] && articulationVisible[i]
              ? x
              : 0),
          0,
        );
      return {
        validAudioDuration,
        jointSupportDuration,
        share:
          validAudioDuration > 0
            ? jointSupportDuration / validAudioDuration
            : 0,
        defined: validAudioDuration > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    utteranceDurations: [2, 3, 5],
    audioValid: [true, true, false],
    transcriptPresent: [true, true, true],
    articulationVisible: [true, false, true],
  },
  output: {
    validAudioDuration: 5,
    jointSupportDuration: 2,
    share: 0.4,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const utteranceVisibleSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "speech-therapy/utterance-visible-support-share",
    title: "Utterance Visible Support Share Tool",
    description:
      "Calculate utterance visible support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        utteranceDurations: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        audioValid: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        transcriptPresent: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        articulationVisible: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: [
        "utteranceDurations",
        "audioValid",
        "transcriptPresent",
        "articulationVisible",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        validAudioDuration: { type: "number" },
        jointSupportDuration: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "validAudioDuration",
        "jointSupportDuration",
        "share",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "utteranceDurations",
          label: "Utterance Durations",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "audioValid",
          label: "Audio Valid",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "transcriptPresent",
          label: "Transcript Present",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "articulationVisible",
          label: "Articulation Visible",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "validAudioDuration",
          label: "Valid Audio Duration",
          valueType: { type: "number" },
        },
        {
          id: "jointSupportDuration",
          label: "Joint Support Duration",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = utteranceVisibleSupportShareTool.execute;
export default utteranceVisibleSupportShareTool;
