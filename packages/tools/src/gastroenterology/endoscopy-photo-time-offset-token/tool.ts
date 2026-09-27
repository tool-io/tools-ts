import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedTime: number;
  readonly suppliedOffset: number;
  readonly offsetKnown: boolean;
};
export type Output = {
  readonly referenceKnown: boolean;
  readonly referenceTime: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedTime: { type: "number" },
    suppliedOffset: { type: "number" },
    offsetKnown: { type: "boolean" },
  },
  required: ["recordedTime", "suppliedOffset", "offsetKnown"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceKnown: { type: "boolean" },
    referenceTime: { type: "number" },
  },
  required: ["referenceKnown", "referenceTime"],
} as const;
/** Reference-time bookkeeping for an existing photo record; no image or identifying metadata is accessed. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedTime, suppliedOffset, offsetKnown } = request;
  const compute = (): Output => {
    return {
      referenceKnown: offsetKnown,
      referenceTime: offsetKnown ? recordedTime - suppliedOffset : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedTime: 100, suppliedOffset: 5, offsetKnown: true },
  output: { referenceKnown: true, referenceTime: 95 },
} satisfies ToolExample<Input, Output>;
export const endoscopyPhotoTimeOffsetTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gastroenterology/endoscopy-photo-time-offset-token",
    title: "Endoscopy Photo Time Offset Token Tool",
    description:
      "Reference-time bookkeeping for an existing photo record; no image or identifying metadata is accessed.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recordedTime: { type: "number" },
        suppliedOffset: { type: "number" },
        offsetKnown: { type: "boolean" },
      },
      required: ["recordedTime", "suppliedOffset", "offsetKnown"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceKnown: { type: "boolean" },
        referenceTime: { type: "number" },
      },
      required: ["referenceKnown", "referenceTime"],
    },
    ports: {
      inputs: [
        {
          id: "recordedTime",
          label: "Recorded Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedOffset",
          label: "Supplied Offset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "offsetKnown",
          label: "Offset Known",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "referenceKnown",
          label: "Reference Known",
          valueType: { type: "boolean" },
        },
        {
          id: "referenceTime",
          label: "Reference Time",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = endoscopyPhotoTimeOffsetTokenTool.execute;
export default endoscopyPhotoTimeOffsetTokenTool;
