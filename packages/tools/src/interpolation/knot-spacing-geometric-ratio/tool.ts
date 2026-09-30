import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousKnot: number;
  readonly currentKnot: number;
  readonly nextKnot: number;
};
export type Output = {
  readonly previousSpacing: number;
  readonly nextSpacing: number;
  readonly ratio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousKnot: { type: "number" },
    currentKnot: { type: "number" },
    nextKnot: { type: "number" },
  },
  required: ["previousKnot", "currentKnot", "nextKnot"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousSpacing: { type: "number" },
    nextSpacing: { type: "number" },
    ratio: { type: "number" },
  },
  required: ["previousSpacing", "nextSpacing", "ratio"],
} as const;
/** Calculate knot spacing geometric ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousKnot, currentKnot, nextKnot } = request;
  const compute = (): Output => {
    H.domain(previousKnot < currentKnot && currentKnot < nextKnot);
    return {
      previousSpacing: currentKnot - previousKnot,
      nextSpacing: nextKnot - currentKnot,
      ratio: (nextKnot - currentKnot) / (currentKnot - previousKnot),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousKnot: 0, currentKnot: 2, nextKnot: 6 },
  output: { previousSpacing: 2, nextSpacing: 4, ratio: 2 },
} satisfies ToolExample<Input, Output>;
export const knotSpacingGeometricRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "interpolation/knot-spacing-geometric-ratio",
    title: "Knot Spacing Geometric Ratio Tool",
    description:
      "Calculate knot spacing geometric ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousKnot: { type: "number" },
        currentKnot: { type: "number" },
        nextKnot: { type: "number" },
      },
      required: ["previousKnot", "currentKnot", "nextKnot"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousSpacing: { type: "number" },
        nextSpacing: { type: "number" },
        ratio: { type: "number" },
      },
      required: ["previousSpacing", "nextSpacing", "ratio"],
    },
    ports: {
      inputs: [
        {
          id: "previousKnot",
          label: "Previous Knot",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "currentKnot",
          label: "Current Knot",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nextKnot",
          label: "Next Knot",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "previousSpacing",
          label: "Previous Spacing",
          valueType: { type: "number" },
        },
        {
          id: "nextSpacing",
          label: "Next Spacing",
          valueType: { type: "number" },
        },
        { id: "ratio", label: "Ratio", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = knotSpacingGeometricRatioTool.execute;
export default knotSpacingGeometricRatioTool;
