import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly efficiency: number;
  readonly forsterRadius: number;
};
export type Output = {
  readonly distance: number;
  readonly radiusRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    efficiency: { type: "number", exclusiveMinimum: 0, maximum: 1 },
    forsterRadius: { type: "number", minimum: 0 },
  },
  required: ["efficiency", "forsterRadius"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { distance: { type: "number" }, radiusRatio: { type: "number" } },
  required: ["distance", "radiusRatio"],
} as const;
/** Ideal FRET E=1/(1+(r/R0)^6) with a caller-supplied Forster radius. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { efficiency, forsterRadius } = request;
  const compute = (): Output => {
    H.domain(efficiency > 0 && efficiency <= 1);
    H.domain(forsterRadius >= 0);
    return {
      distance: forsterRadius * (1 / efficiency - 1) ** (1 / 6),
      radiusRatio: (1 / efficiency - 1) ** (1 / 6),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { efficiency: 0.5, forsterRadius: 5 },
  output: { distance: 5, radiusRatio: 1 },
} satisfies ToolExample<Input, Output>;
export const fretDistanceEfficiencyInverseTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biophysics/fret-distance-efficiency-inverse-term",
    title: "FRET Distance Efficiency Inverse Term Tool",
    description:
      "Ideal FRET E=1/(1+(r/R0)^6) with a caller-supplied Forster radius.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        efficiency: { type: "number", exclusiveMinimum: 0, maximum: 1 },
        forsterRadius: { type: "number", minimum: 0 },
      },
      required: ["efficiency", "forsterRadius"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distance: { type: "number" },
        radiusRatio: { type: "number" },
      },
      required: ["distance", "radiusRatio"],
    },
    ports: {
      inputs: [
        {
          id: "efficiency",
          label: "Efficiency",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "forsterRadius",
          label: "Forster Radius",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "distance", label: "Distance", valueType: { type: "number" } },
        {
          id: "radiusRatio",
          label: "Radius Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = fretDistanceEfficiencyInverseTermTool.execute;
export default fretDistanceEfficiencyInverseTermTool;
