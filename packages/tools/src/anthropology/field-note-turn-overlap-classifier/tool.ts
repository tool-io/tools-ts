import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstStart: number;
  readonly firstEnd: number;
  readonly secondStart: number;
  readonly secondEnd: number;
};
export type Output = { readonly overlap: number; readonly role: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstStart: { type: "number" },
    firstEnd: { type: "number" },
    secondStart: { type: "number" },
    secondEnd: { type: "number" },
  },
  required: ["firstStart", "firstEnd", "secondStart", "secondEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    overlap: { type: "number" },
    role: { type: "string", maxLength: 8192 },
  },
  required: ["overlap", "role"],
} as const;
/** Classify supplied half-open speech-turn intervals, with no inference about interruption or intent. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstStart, firstEnd, secondStart, secondEnd } = request;
  const compute = (): Output => {
    H.domain(firstEnd >= firstStart && secondEnd >= secondStart);
    const overlap = Math.max(
      0,
      Math.min(firstEnd, secondEnd) - Math.max(firstStart, secondStart),
    );
    return {
      overlap,
      role:
        overlap > 0
          ? "overlap"
          : firstEnd === secondStart || secondEnd === firstStart
            ? "touching"
            : "separate",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstStart: 0, firstEnd: 5, secondStart: 3, secondEnd: 8 },
  output: { overlap: 2, role: "overlap" },
} satisfies ToolExample<Input, Output>;
export const fieldNoteTurnOverlapClassifierTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anthropology/field-note-turn-overlap-classifier",
    title: "Field Note Turn Overlap Classifier Tool",
    description:
      "Classify supplied half-open speech-turn intervals, with no inference about interruption or intent.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstStart: { type: "number" },
        firstEnd: { type: "number" },
        secondStart: { type: "number" },
        secondEnd: { type: "number" },
      },
      required: ["firstStart", "firstEnd", "secondStart", "secondEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        overlap: { type: "number" },
        role: { type: "string", maxLength: 8192 },
      },
      required: ["overlap", "role"],
    },
    ports: {
      inputs: [
        {
          id: "firstStart",
          label: "First Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstEnd",
          label: "First End",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondStart",
          label: "Second Start",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondEnd",
          label: "Second End",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "overlap", label: "Overlap", valueType: { type: "number" } },
        { id: "role", label: "Role", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = fieldNoteTurnOverlapClassifierTool.execute;
export default fieldNoteTurnOverlapClassifierTool;
