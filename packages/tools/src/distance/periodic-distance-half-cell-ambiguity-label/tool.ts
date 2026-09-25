import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly difference: number; readonly period: number };
export type Output = { readonly distance: number; readonly ambiguous: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    difference: { type: "number" },
    period: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["difference", "period"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { distance: { type: "number" }, ambiguous: { type: "boolean" } },
  required: ["distance", "ambiguous"],
} as const;
/** Calculate periodic distance half cell ambiguity label from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { difference, period } = input;
  const compute = (): Output => {
    H.positive(period);
    const r = H.mod(difference, period);
    return { distance: Math.min(r, period - r), ambiguous: r === period / 2 };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { difference: 5, period: 10 },
  output: { distance: 5, ambiguous: true },
} satisfies ToolExample<Input, Output>;
export const periodicDistanceHalfCellAmbiguityLabelTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "distance/periodic-distance-half-cell-ambiguity-label",
      title: "Periodic Distance Half Cell Ambiguity Label Tool",
      description:
        "Calculate periodic distance half cell ambiguity label from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          difference: { type: "number" },
          period: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["difference", "period"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          distance: { type: "number" },
          ambiguous: { type: "boolean" },
        },
        required: ["distance", "ambiguous"],
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
            id: "period",
            label: "Period",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "distance", label: "Distance", valueType: { type: "number" } },
          {
            id: "ambiguous",
            label: "Ambiguous",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = periodicDistanceHalfCellAmbiguityLabelTool.execute;
export default periodicDistanceHalfCellAmbiguityLabelTool;
