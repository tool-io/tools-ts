import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coordinates: readonly number[];
  readonly originShift: readonly number[];
};
export type Output = {
  readonly shifted: readonly number[];
  readonly displacementNorm: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coordinates: { type: "array", maxItems: 256, items: { type: "number" } },
    originShift: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["coordinates", "originShift"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shifted: { type: "array", maxItems: 256, items: { type: "number" } },
    displacementNorm: { type: "number" },
  },
  required: ["shifted", "displacementNorm"],
} as const;
/** Passive coordinate change to a new origin displaced by a supplied vector. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coordinates, originShift } = request;
  const compute = (): Output => {
    H.sameLength(coordinates, originShift);
    H.domain(coordinates.length > 0);
    return {
      shifted: coordinates.map((x, i) => x - originShift[i]),
      displacementNorm: Math.hypot(...originShift),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coordinates: [3, 4], originShift: [1, 2] },
  output: { shifted: [2, 2], displacementNorm: 2.23606797749979 },
} satisfies ToolExample<Input, Output>;
export const vectorAffineOriginShiftBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vector/vector-affine-origin-shift-budget",
    title: "Vector Affine Origin Shift Budget Tool",
    description:
      "Passive coordinate change to a new origin displaced by a supplied vector.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coordinates: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        originShift: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["coordinates", "originShift"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shifted: { type: "array", maxItems: 256, items: { type: "number" } },
        displacementNorm: { type: "number" },
      },
      required: ["shifted", "displacementNorm"],
    },
    ports: {
      inputs: [
        {
          id: "coordinates",
          label: "Coordinates",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "originShift",
          label: "Origin Shift",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "shifted",
          label: "Shifted",
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "displacementNorm",
          label: "Displacement Norm",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = vectorAffineOriginShiftBudgetTool.execute;
export default vectorAffineOriginShiftBudgetTool;
