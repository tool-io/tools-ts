import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly difference: number; readonly weight: number };
export type Output = { readonly lower: number; readonly upper: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    difference: { type: "number" },
    weight: { type: "number", minimum: 0 },
  },
  required: ["difference", "weight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { lower: { type: "number" }, upper: { type: "number" } },
  required: ["lower", "upper"],
} as const;
/** Calculate weighted manhattan axis subgradient from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { difference, weight } = request;
  const compute = (): Output => {
    H.domain(weight >= 0);
    return {
      lower: difference < 0 ? -weight : difference > 0 ? weight : -weight,
      upper: difference < 0 ? -weight : weight,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { difference: 0, weight: 3 },
  output: { lower: -3, upper: 3 },
} satisfies ToolExample<Input, Output>;
export const weightedManhattanAxisSubgradientTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "distance/weighted-manhattan-axis-subgradient",
    title: "Weighted Manhattan Axis Subgradient Tool",
    description:
      "Calculate weighted manhattan axis subgradient from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        difference: { type: "number" },
        weight: { type: "number", minimum: 0 },
      },
      required: ["difference", "weight"],
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
          id: "difference",
          label: "Difference",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "weight",
          label: "Weight",
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
export const run = weightedManhattanAxisSubgradientTool.execute;
export default weightedManhattanAxisSubgradientTool;
