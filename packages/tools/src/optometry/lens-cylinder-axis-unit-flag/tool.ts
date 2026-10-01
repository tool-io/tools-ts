import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly axis: number;
  readonly suppliedDegreesPerUnit: number;
  readonly normalizeHalfTurn: boolean;
};
export type Output = {
  readonly degrees: number;
  readonly normalizedDegrees: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    axis: { type: "number" },
    suppliedDegreesPerUnit: { type: "number", exclusiveMinimum: 0 },
    normalizeHalfTurn: { type: "boolean" },
  },
  required: ["axis", "suppliedDegreesPerUnit", "normalizeHalfTurn"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    degrees: { type: "number" },
    normalizedDegrees: { type: "number" },
  },
  required: ["degrees", "normalizedDegrees"],
} as const;
/** Convert a supplied axis unit and optionally normalize a 180-degree orientation; no prescription calculation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { axis, suppliedDegreesPerUnit, normalizeHalfTurn } = request;
  const compute = (): Output => {
    H.positive(suppliedDegreesPerUnit);
    const degrees = H.finite(axis * suppliedDegreesPerUnit),
      r = degrees % 180;
    return {
      degrees,
      normalizedDegrees: normalizeHalfTurn ? (r < 0 ? r + 180 : r) : degrees,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { axis: 200, suppliedDegreesPerUnit: 1, normalizeHalfTurn: true },
  output: { degrees: 200, normalizedDegrees: 20 },
} satisfies ToolExample<Input, Output>;
export const lensCylinderAxisUnitFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "optometry/lens-cylinder-axis-unit-flag",
    title: "Lens Cylinder Axis Unit Flag Tool",
    description:
      "Convert a supplied axis unit and optionally normalize a 180-degree orientation; no prescription calculation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        axis: { type: "number" },
        suppliedDegreesPerUnit: { type: "number", exclusiveMinimum: 0 },
        normalizeHalfTurn: { type: "boolean" },
      },
      required: ["axis", "suppliedDegreesPerUnit", "normalizeHalfTurn"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        degrees: { type: "number" },
        normalizedDegrees: { type: "number" },
      },
      required: ["degrees", "normalizedDegrees"],
    },
    ports: {
      inputs: [
        {
          id: "axis",
          label: "Axis",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedDegreesPerUnit",
          label: "Supplied Degrees Per Unit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "normalizeHalfTurn",
          label: "Normalize Half Turn",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "degrees", label: "Degrees", valueType: { type: "number" } },
        {
          id: "normalizedDegrees",
          label: "Normalized Degrees",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = lensCylinderAxisUnitFlagTool.execute;
export default lensCylinderAxisUnitFlagTool;
