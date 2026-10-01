import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstStart: number;
  readonly firstEnd: number;
  readonly secondStart: number;
  readonly secondEnd: number;
};
export type Output = { readonly overlap: number };
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
  properties: { overlap: { type: "number" } },
  required: ["overlap"],
} as const;
/** Intersect public historical archive date coordinates as half-open intervals without operational inference. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstStart, firstEnd, secondStart, secondEnd } = request;
  const compute = (): Output => {
    H.domain(firstEnd >= firstStart && secondEnd >= secondStart);
    return {
      overlap: Math.max(
        0,
        Math.min(firstEnd, secondEnd) - Math.max(firstStart, secondStart),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstStart: 10, firstEnd: 20, secondStart: 15, secondEnd: 25 },
  output: { overlap: 5 },
} satisfies ToolExample<Input, Output>;
export const publicArchiveUnitDateOverlapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "military-science/public-archive-unit-date-overlap",
    title: "Public Archive Unit Date Overlap Tool",
    description:
      "Intersect public historical archive date coordinates as half-open intervals without operational inference.",
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
      properties: { overlap: { type: "number" } },
      required: ["overlap"],
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
      ],
    },
  },
  calculate,
});
export const run = publicArchiveUnitDateOverlapTool.execute;
export default publicArchiveUnitDateOverlapTool;
