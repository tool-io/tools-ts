import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousEnd: number;
  readonly nextStart: number;
};
export type Output = { readonly gap: number; readonly overlap: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousEnd: { type: "number" },
    nextStart: { type: "number" },
  },
  required: ["previousEnd", "nextStart"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "number" }, overlap: { type: "boolean" } },
  required: ["gap", "overlap"],
} as const;
/** Compare supplied annotated phoneme boundaries without speech diagnosis or transcription inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousEnd, nextStart } = request;
  const compute = (): Output => {
    return { gap: nextStart - previousEnd, overlap: nextStart < previousEnd };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousEnd: 10, nextStart: 12 },
  output: { gap: 2, overlap: false },
} satisfies ToolExample<Input, Output>;
export const phonemeBoundaryTimeGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "speech-therapy/phoneme-boundary-time-gap",
    title: "Phoneme Boundary Time Gap Tool",
    description:
      "Compare supplied annotated phoneme boundaries without speech diagnosis or transcription inference.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousEnd: { type: "number" },
        nextStart: { type: "number" },
      },
      required: ["previousEnd", "nextStart"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gap: { type: "number" }, overlap: { type: "boolean" } },
      required: ["gap", "overlap"],
    },
    ports: {
      inputs: [
        {
          id: "previousEnd",
          label: "Previous End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nextStart",
          label: "Next Start",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "gap", label: "Gap", valueType: { type: "number" } },
        { id: "overlap", label: "Overlap", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = phonemeBoundaryTimeGapTool.execute;
export default phonemeBoundaryTimeGapTool;
