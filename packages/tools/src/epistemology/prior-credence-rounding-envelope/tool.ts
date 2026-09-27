import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly reported: number; readonly halfwidth: number };
export type Output = { readonly lower: number; readonly upper: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reported: { type: "number", minimum: 0, maximum: 1 },
    halfwidth: { type: "number", minimum: 0 },
  },
  required: ["reported", "halfwidth"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lower: { type: "number" }, upper: { type: "number" } },
  required: ["lower", "upper"],
} as const;
/** Supplied credence precision envelope clipped to probability bounds; no prior is selected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { reported, halfwidth } = request;
  const compute = (): Output => {
    H.probability(reported);
    H.domain(halfwidth >= 0);
    return {
      lower: Math.max(0, reported - halfwidth),
      upper: Math.min(1, reported + halfwidth),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { reported: 0.5, halfwidth: 0.05 },
  output: { lower: 0.45, upper: 0.55 },
} satisfies ToolExample<Input, Output>;
export const priorCredenceRoundingEnvelopeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "epistemology/prior-credence-rounding-envelope",
    title: "Prior Credence Rounding Envelope Tool",
    description:
      "Supplied credence precision envelope clipped to probability bounds; no prior is selected.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        reported: { type: "number", minimum: 0, maximum: 1 },
        halfwidth: { type: "number", minimum: 0 },
      },
      required: ["reported", "halfwidth"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { lower: { type: "number" }, upper: { type: "number" } },
      required: ["lower", "upper"],
    },
    ports: {
      inputs: [
        {
          id: "reported",
          label: "Reported",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "halfwidth",
          label: "Halfwidth",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "lower", label: "Lower", valueType: { type: "number" } },
        { id: "upper", label: "Upper", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = priorCredenceRoundingEnvelopeTool.execute;
export default priorCredenceRoundingEnvelopeTool;
