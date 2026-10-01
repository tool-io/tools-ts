import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly normalizedValue: number;
  readonly oldAnchor: number;
  readonly newAnchor: number;
  readonly span: number;
};
export type Output = { readonly shiftedValue: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    normalizedValue: { type: "number" },
    oldAnchor: { type: "number" },
    newAnchor: { type: "number" },
    span: { type: "number" },
  },
  required: ["normalizedValue", "oldAnchor", "newAnchor", "span"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { shiftedValue: { type: "number" } },
  required: ["shiftedValue"],
} as const;
/** Shift the origin of an already normalized coordinate while keeping the same nonzero span. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { normalizedValue, oldAnchor, newAnchor, span } = request;
  const compute = (): Output => {
    H.domain(span !== 0);
    return { shiftedValue: normalizedValue + (oldAnchor - newAnchor) / span };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { normalizedValue: 0.5, oldAnchor: 10, newAnchor: 8, span: 4 },
  output: { shiftedValue: 1 },
} satisfies ToolExample<Input, Output>;
export const unitRangeAnchorShiftTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "normalize/unit-range-anchor-shift",
    title: "Unit Range Anchor Shift Tool",
    description:
      "Shift the origin of an already normalized coordinate while keeping the same nonzero span.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        normalizedValue: { type: "number" },
        oldAnchor: { type: "number" },
        newAnchor: { type: "number" },
        span: { type: "number" },
      },
      required: ["normalizedValue", "oldAnchor", "newAnchor", "span"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { shiftedValue: { type: "number" } },
      required: ["shiftedValue"],
    },
    ports: {
      inputs: [
        {
          id: "normalizedValue",
          label: "Normalized Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "oldAnchor",
          label: "Old Anchor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "newAnchor",
          label: "New Anchor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "span",
          label: "Span",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "shiftedValue",
          label: "Shifted Value",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = unitRangeAnchorShiftTool.execute;
export default unitRangeAnchorShiftTool;
