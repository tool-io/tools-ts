import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eventVolumes: readonly number[];
  readonly completeRecord: readonly boolean[];
  readonly volumeVerified: readonly boolean[];
};
export type Output = {
  readonly recordedVolume: number;
  readonly supportedVolume: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eventVolumes: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    completeRecord: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    volumeVerified: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: ["eventVolumes", "completeRecord", "volumeVerified"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedVolume: { type: "number" },
    supportedVolume: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["recordedVolume", "supportedVolume", "share", "defined"],
} as const;
/** Calculate diary volume support share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eventVolumes, completeRecord, volumeVerified } = request;
  const compute = (): Output => {
    H.sameLength(eventVolumes, completeRecord);
    H.sameLength(eventVolumes, volumeVerified);
    H.domain(eventVolumes.every((x) => x >= 0));
    return (() => {
      const recordedVolume = eventVolumes.reduce((a, b) => a + b, 0),
        supportedVolume = eventVolumes.reduce(
          (s, x, i) => s + (completeRecord[i] && volumeVerified[i] ? x : 0),
          0,
        );
      return {
        recordedVolume,
        supportedVolume,
        share: recordedVolume > 0 ? supportedVolume / recordedVolume : 0,
        defined: recordedVolume > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    eventVolumes: [2, 3, 5],
    completeRecord: [true, true, false],
    volumeVerified: [true, false, true],
  },
  output: { recordedVolume: 10, supportedVolume: 2, share: 0.2, defined: true },
} satisfies ToolExample<Input, Output>;
export const diaryVolumeSupportShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urology/diary-volume-support-share",
    title: "Diary Volume Support Share Tool",
    description:
      "Calculate diary volume support share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eventVolumes: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        completeRecord: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        volumeVerified: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["eventVolumes", "completeRecord", "volumeVerified"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedVolume: { type: "number" },
        supportedVolume: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["recordedVolume", "supportedVolume", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "eventVolumes",
          label: "Event Volumes",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "completeRecord",
          label: "Complete Record",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "volumeVerified",
          label: "Volume Verified",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "recordedVolume",
          label: "Recorded Volume",
          valueType: { type: "number" },
        },
        {
          id: "supportedVolume",
          label: "Supported Volume",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = diaryVolumeSupportShareTool.execute;
export default diaryVolumeSupportShareTool;
