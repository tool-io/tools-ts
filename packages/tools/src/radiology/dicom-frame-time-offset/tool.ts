import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly zeroBasedFrameIndex: number;
  readonly frameTimeMilliseconds: number;
};
export type Output = { readonly offsetMilliseconds: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    zeroBasedFrameIndex: { type: "integer", minimum: 0 },
    frameTimeMilliseconds: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["zeroBasedFrameIndex", "frameTimeMilliseconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { offsetMilliseconds: { type: "number" } },
  required: ["offsetMilliseconds"],
} as const;
/** Convert an explicit zero-based frame index to an offset under a supplied constant DICOM frame-time assumption. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { zeroBasedFrameIndex, frameTimeMilliseconds } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(zeroBasedFrameIndex) &&
        zeroBasedFrameIndex >= 0 &&
        zeroBasedFrameIndex <= Number.MAX_SAFE_INTEGER,
      "zeroBasedFrameIndex",
    ),
      zeroBasedFrameIndex);
    (H.domain(frameTimeMilliseconds > 0, "frameTimeMilliseconds"),
      frameTimeMilliseconds);
    return { offsetMilliseconds: zeroBasedFrameIndex * frameTimeMilliseconds };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { zeroBasedFrameIndex: 12, frameTimeMilliseconds: 40 },
  output: { offsetMilliseconds: 480 },
} satisfies ToolExample<Input, Output>;
export const dicomFrameTimeOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["radiology", "health and medicine"],
      keywords: ["radiology", "health and medicine"],
    },
    id: "radiology/dicom-frame-time-offset",
    title: "DICOM Frame Time Offset",
    description:
      "Convert an explicit zero-based frame index to an offset under a supplied constant DICOM frame-time assumption.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        zeroBasedFrameIndex: { type: "integer", minimum: 0 },
        frameTimeMilliseconds: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["zeroBasedFrameIndex", "frameTimeMilliseconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { offsetMilliseconds: { type: "number" } },
      required: ["offsetMilliseconds"],
    },
    ports: {
      inputs: [
        {
          id: "zeroBasedFrameIndex",
          label: "Zero Based Frame Index",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "frameTimeMilliseconds",
          label: "Frame Time Milliseconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "offsetMilliseconds",
          label: "Offset Milliseconds",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = dicomFrameTimeOffsetTool.execute;
export default dicomFrameTimeOffsetTool;
