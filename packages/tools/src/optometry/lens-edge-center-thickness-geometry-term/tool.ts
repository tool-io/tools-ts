import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly semiDiameter: number;
  readonly frontRadius: number;
  readonly backRadius: number;
  readonly centerThickness: number;
  readonly frontConvex: boolean;
  readonly backConvex: boolean;
};
export type Output = {
  readonly frontSag: number;
  readonly backSag: number;
  readonly edgeThickness: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    semiDiameter: { type: "number", minimum: 0 },
    frontRadius: { type: "number", exclusiveMinimum: 0 },
    backRadius: { type: "number", exclusiveMinimum: 0 },
    centerThickness: { type: "number", minimum: 0 },
    frontConvex: { type: "boolean" },
    backConvex: { type: "boolean" },
  },
  required: [
    "semiDiameter",
    "frontRadius",
    "backRadius",
    "centerThickness",
    "frontConvex",
    "backConvex",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    frontSag: { type: "number" },
    backSag: { type: "number" },
    edgeThickness: { type: "number" },
  },
  required: ["frontSag", "backSag", "edgeThickness"],
} as const;
/** Ideal spherical-surface sagittae with an explicit convex/concave thickness convention; negative edge thickness exposes inconsistent model dimensions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    semiDiameter,
    frontRadius,
    backRadius,
    centerThickness,
    frontConvex,
    backConvex,
  } = request;
  const compute = (): Output => {
    H.domain(
      semiDiameter >= 0 &&
        frontRadius >= semiDiameter &&
        backRadius >= semiDiameter &&
        frontRadius > 0 &&
        backRadius > 0 &&
        centerThickness >= 0,
    );
    const sag = (r: number) => {
      const q = semiDiameter / r;
      return (semiDiameter * q) / (1 + Math.sqrt((1 - q) * (1 + q)));
    };
    const frontSag = sag(frontRadius),
      backSag = sag(backRadius);
    return {
      frontSag,
      backSag,
      edgeThickness:
        centerThickness -
        (frontConvex ? 1 : -1) * frontSag -
        (backConvex ? 1 : -1) * backSag,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    semiDiameter: 3,
    frontRadius: 5,
    backRadius: 5,
    centerThickness: 3,
    frontConvex: true,
    backConvex: true,
  },
  output: {
    frontSag: 0.9999999999999999,
    backSag: 0.9999999999999999,
    edgeThickness: 1,
  },
} satisfies ToolExample<Input, Output>;
export const lensEdgeCenterThicknessGeometryTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "optometry/lens-edge-center-thickness-geometry-term",
      title: "Lens Edge Center Thickness Geometry Term Tool",
      description:
        "Ideal spherical-surface sagittae with an explicit convex/concave thickness convention; negative edge thickness exposes inconsistent model dimensions.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          semiDiameter: { type: "number", minimum: 0 },
          frontRadius: { type: "number", exclusiveMinimum: 0 },
          backRadius: { type: "number", exclusiveMinimum: 0 },
          centerThickness: { type: "number", minimum: 0 },
          frontConvex: { type: "boolean" },
          backConvex: { type: "boolean" },
        },
        required: [
          "semiDiameter",
          "frontRadius",
          "backRadius",
          "centerThickness",
          "frontConvex",
          "backConvex",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          frontSag: { type: "number" },
          backSag: { type: "number" },
          edgeThickness: { type: "number" },
        },
        required: ["frontSag", "backSag", "edgeThickness"],
      },
      ports: {
        inputs: [
          {
            id: "semiDiameter",
            label: "Semi Diameter",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "frontRadius",
            label: "Front Radius",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "backRadius",
            label: "Back Radius",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "centerThickness",
            label: "Center Thickness",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "frontConvex",
            label: "Front Convex",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "backConvex",
            label: "Back Convex",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "frontSag", label: "Front Sag", valueType: { type: "number" } },
          { id: "backSag", label: "Back Sag", valueType: { type: "number" } },
          {
            id: "edgeThickness",
            label: "Edge Thickness",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = lensEdgeCenterThicknessGeometryTermTool.execute;
export default lensEdgeCenterThicknessGeometryTermTool;
