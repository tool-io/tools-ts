import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly spacing: number;
  readonly firstReach: number;
  readonly secondReach: number;
};
export type Output = { readonly gap: number; readonly overlap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    spacing: { type: "number", minimum: 0 },
    firstReach: { type: "number", minimum: 0 },
    secondReach: { type: "number", minimum: 0 },
  },
  required: ["spacing", "firstReach", "secondReach"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { gap: { type: "number" }, overlap: { type: "number" } },
  required: ["gap", "overlap"],
} as const;
/** Use explicit one-dimensional effective light reaches, without inferring illuminance thresholds. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { spacing, firstReach, secondReach } = request;
  const compute = (): Output => {
    H.domain(spacing >= 0 && firstReach >= 0 && secondReach >= 0);
    return {
      gap: Math.max(0, spacing - firstReach - secondReach),
      overlap: Math.max(0, firstReach + secondReach - spacing),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { spacing: 10, firstReach: 3, secondReach: 4 },
  output: { gap: 3, overlap: 0 },
} satisfies ToolExample<Input, Output>;
export const landscapeLightSpacingDarkGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "landscape-architecture/landscape-light-spacing-dark-gap",
    title: "Landscape Light Spacing Dark Gap Tool",
    description:
      "Use explicit one-dimensional effective light reaches, without inferring illuminance thresholds.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        spacing: { type: "number", minimum: 0 },
        firstReach: { type: "number", minimum: 0 },
        secondReach: { type: "number", minimum: 0 },
      },
      required: ["spacing", "firstReach", "secondReach"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { gap: { type: "number" }, overlap: { type: "number" } },
      required: ["gap", "overlap"],
    },
    ports: {
      inputs: [
        {
          id: "spacing",
          label: "Spacing",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstReach",
          label: "First Reach",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondReach",
          label: "Second Reach",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "gap", label: "Gap", valueType: { type: "number" } },
        { id: "overlap", label: "Overlap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = landscapeLightSpacingDarkGapTool.execute;
export default landscapeLightSpacingDarkGapTool;
