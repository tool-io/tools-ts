import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly onset: number;
  readonly gridOrigin: number;
  readonly gridStep: number;
  readonly suppliedGridIndex: number;
};
export type Output = {
  readonly gridTime: number;
  readonly signedOffset: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    onset: { type: "number" },
    gridOrigin: { type: "number" },
    gridStep: { type: "number", exclusiveMinimum: 0 },
    suppliedGridIndex: { type: "integer" },
  },
  required: ["onset", "gridOrigin", "gridStep", "suppliedGridIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gridTime: { type: "number" },
    signedOffset: { type: "number" },
  },
  required: ["gridTime", "signedOffset"],
} as const;
/** Compare a supplied transcription onset with an explicitly chosen grid point without rhythmic or cultural inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { onset, gridOrigin, gridStep, suppliedGridIndex } = request;
  const compute = (): Output => {
    H.positive(gridStep);
    return {
      gridTime: gridOrigin + suppliedGridIndex * gridStep,
      signedOffset: onset - gridOrigin - suppliedGridIndex * gridStep,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { onset: 1.1, gridOrigin: 0, gridStep: 0.25, suppliedGridIndex: 4 },
  output: { gridTime: 1, signedOffset: 0.10000000000000009 },
} satisfies ToolExample<Input, Output>;
export const transcriptionOnsetGridOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ethnomusicology/transcription-onset-grid-offset",
    title: "Transcription Onset Grid Offset Tool",
    description:
      "Compare a supplied transcription onset with an explicitly chosen grid point without rhythmic or cultural inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        onset: { type: "number" },
        gridOrigin: { type: "number" },
        gridStep: { type: "number", exclusiveMinimum: 0 },
        suppliedGridIndex: { type: "integer" },
      },
      required: ["onset", "gridOrigin", "gridStep", "suppliedGridIndex"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gridTime: { type: "number" },
        signedOffset: { type: "number" },
      },
      required: ["gridTime", "signedOffset"],
    },
    ports: {
      inputs: [
        {
          id: "onset",
          label: "Onset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gridOrigin",
          label: "Grid Origin",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gridStep",
          label: "Grid Step",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedGridIndex",
          label: "Supplied Grid Index",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "gridTime", label: "Grid Time", valueType: { type: "number" } },
        {
          id: "signedOffset",
          label: "Signed Offset",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = transcriptionOnsetGridOffsetTool.execute;
export default transcriptionOnsetGridOffsetTool;
