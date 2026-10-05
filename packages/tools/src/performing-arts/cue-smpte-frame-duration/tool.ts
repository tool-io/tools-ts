import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly startFrame: number;
  readonly endFrame: number;
  readonly frameRateNumerator: number;
  readonly frameRateDenominator: number;
};
export type Output = {
  readonly durationFrames: number;
  readonly seconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    startFrame: { type: "integer", minimum: 0 },
    endFrame: { type: "integer" },
    frameRateNumerator: { type: "integer", minimum: 1, maximum: 120000 },
    frameRateDenominator: { type: "integer", minimum: 1, maximum: 10000 },
  },
  required: [
    "startFrame",
    "endFrame",
    "frameRateNumerator",
    "frameRateDenominator",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    durationFrames: { type: "integer" },
    seconds: { type: "number" },
  },
  required: ["durationFrames", "seconds"],
} as const;
/** Convert an interval of absolute frame counts to seconds using an explicit rational frame rate. Inputs are frame indices rather than drop-frame timecode labels. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { startFrame, endFrame, frameRateNumerator, frameRateDenominator } =
    request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(startFrame) &&
        startFrame >= 0 &&
        startFrame <= Number.MAX_SAFE_INTEGER,
      "startFrame",
    ),
      startFrame);
    (H.domain(
      Number.isSafeInteger(endFrame) &&
        endFrame >= startFrame &&
        endFrame <= Number.MAX_SAFE_INTEGER,
      "endFrame",
    ),
      endFrame);
    (H.domain(
      Number.isSafeInteger(frameRateNumerator) &&
        frameRateNumerator >= 1 &&
        frameRateNumerator <= 120000,
      "frameRateNumerator",
    ),
      frameRateNumerator);
    (H.domain(
      Number.isSafeInteger(frameRateDenominator) &&
        frameRateDenominator >= 1 &&
        frameRateDenominator <= 10000,
      "frameRateDenominator",
    ),
      frameRateDenominator);
    const durationFrames = endFrame - startFrame;
    return {
      durationFrames,
      seconds: (durationFrames * frameRateDenominator) / frameRateNumerator,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    startFrame: 100,
    endFrame: 400,
    frameRateNumerator: 30000,
    frameRateDenominator: 1001,
  },
  output: { durationFrames: 300, seconds: 10.01 },
} satisfies ToolExample<Input, Output>;
export const cueSmpteFrameDurationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "performing-arts/cue-smpte-frame-duration",
    title: "Cue Smpte Frame Duration Tool",
    description:
      "Convert an interval of absolute frame counts to seconds using an explicit rational frame rate. Inputs are frame indices rather than drop-frame timecode labels.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        startFrame: { type: "integer", minimum: 0 },
        endFrame: { type: "integer" },
        frameRateNumerator: { type: "integer", minimum: 1, maximum: 120000 },
        frameRateDenominator: { type: "integer", minimum: 1, maximum: 10000 },
      },
      required: [
        "startFrame",
        "endFrame",
        "frameRateNumerator",
        "frameRateDenominator",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        durationFrames: { type: "integer" },
        seconds: { type: "number" },
      },
      required: ["durationFrames", "seconds"],
    },
    ports: {
      inputs: [
        {
          id: "startFrame",
          label: "Start Frame",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "endFrame",
          label: "End Frame",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "frameRateNumerator",
          label: "Frame Rate Numerator",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "frameRateDenominator",
          label: "Frame Rate Denominator",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "durationFrames",
          label: "Duration Frames",
          valueType: { type: "integer" },
        },
        { id: "seconds", label: "Seconds", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cueSmpteFrameDurationTool.execute;
export default cueSmpteFrameDurationTool;
