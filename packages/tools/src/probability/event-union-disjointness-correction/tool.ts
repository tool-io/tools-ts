import {
  defineSchemaCalculation,
  requireInput,
  requireOutput,
  canonicalOutput,
  domain,
  probability,
} from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";
export type Input = {
  readonly left: number;
  readonly right: number;
  readonly intersection: number;
};
export type Output = { readonly union: number; readonly correction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    left: { type: "number", minimum: 0, maximum: 1 },
    right: { type: "number", minimum: 0, maximum: 1 },
    intersection: { type: "number" },
  },
  required: ["left", "right", "intersection"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { union: { type: "number" }, correction: { type: "number" } },
  required: ["union", "correction"],
} as const;
/** Compute event union disjointness correction from explicit bounded inputs. */
export function calculate(input: Input): Output {
  requireInput(input, inputSchema);
  const { left, right, intersection } = input;
  const compute = (): Output => {
    probability(left);
    probability(right);
    domain(
      intersection >= Math.max(0, left + right - 1) &&
        intersection <= Math.min(left, right),
    );
    return { union: left + right - intersection, correction: -intersection };
  };
  const output = canonicalOutput(compute());
  requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { left: 0.5, right: 0.5, intersection: 0.25 },
  output: { union: 0.75, correction: -0.25 },
} satisfies ToolExample<Input, Output>;
export const eventUnionDisjointnessCorrectionTool = defineSchemaCalculation<
  Input,
  Output
>({
  id: "probability/event-union-disjointness-correction",
  title: "Event Union Disjointness Correction Tool",
  description:
    "Compute event union disjointness correction from explicit bounded inputs.",
  calculate,
  inputSchema,
  outputSchema,
  ports: {
    inputs: [
      {
        id: "left",
        label: "Left",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "right",
        label: "Right",
        required: true,
        valueType: { type: "number" },
      },
      {
        id: "intersection",
        label: "Intersection",
        required: true,
        valueType: { type: "number" },
      },
    ],
    outputs: [
      { id: "union", label: "Union", valueType: { type: "number" } },
      { id: "correction", label: "Correction", valueType: { type: "number" } },
    ],
  },
});
export const run = eventUnionDisjointnessCorrectionTool.execute;
export default eventUnionDisjointnessCorrectionTool;
