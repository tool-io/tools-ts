import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SurfaceShape =
  | "capsule"
  | "cone"
  | "conical-frustum"
  | "cube"
  | "cylinder"
  | "ellipsoid"
  | "rectangular-prism"
  | "sphere"
  | "spherical-cap"
  | "square-pyramid";

const knudThomsenExponent = 1.6075;

const ellipsoidSurfaceArea = (a: number, b: number, c: number): number => {
  const scale = Math.max(a, b, c);
  const x = a / scale;
  const y = b / scale;
  const z = c / scale;
  return (
    4 *
    Math.PI *
    scale ** 2 *
    (((x * y) ** knudThomsenExponent +
      (x * z) ** knudThomsenExponent +
      (y * z) ** knudThomsenExponent) /
      3) **
      (1 / knudThomsenExponent)
  );
};

export const calculateSurfaceArea = (
  shape: SurfaceShape,
  dimensionA: number,
  dimensionB?: number,
  dimensionC?: number,
): number | null => {
  const values = [dimensionA, dimensionB, dimensionC];
  if (
    values.some(
      (value) => value !== undefined && (!Number.isFinite(value) || value <= 0),
    )
  )
    return null;
  let result: number | null = null;
  if (
    shape === "sphere" &&
    dimensionB === undefined &&
    dimensionC === undefined
  )
    result = 4 * Math.PI * dimensionA ** 2;
  else if (
    shape === "cube" &&
    dimensionB === undefined &&
    dimensionC === undefined
  )
    result = 6 * dimensionA ** 2;
  else if (
    shape === "cone" &&
    dimensionB !== undefined &&
    dimensionC === undefined
  )
    result =
      Math.PI * dimensionA * (dimensionA + Math.hypot(dimensionA, dimensionB));
  else if (
    shape === "cylinder" &&
    dimensionB !== undefined &&
    dimensionC === undefined
  )
    result = 2 * Math.PI * dimensionA * (dimensionA + dimensionB);
  else if (
    shape === "capsule" &&
    dimensionB !== undefined &&
    dimensionC === undefined
  )
    result =
      4 * Math.PI * dimensionA ** 2 + 2 * Math.PI * dimensionA * dimensionB;
  else if (
    shape === "spherical-cap" &&
    dimensionB !== undefined &&
    dimensionC === undefined &&
    dimensionB <= 2 * dimensionA
  )
    result = Math.PI * dimensionB * (4 * dimensionA - dimensionB);
  else if (
    shape === "square-pyramid" &&
    dimensionB !== undefined &&
    dimensionC === undefined
  )
    result =
      dimensionA ** 2 + 2 * dimensionA * Math.hypot(dimensionA / 2, dimensionB);
  else if (
    shape === "rectangular-prism" &&
    dimensionB !== undefined &&
    dimensionC !== undefined
  )
    result =
      2 *
      (dimensionA * dimensionB +
        dimensionA * dimensionC +
        dimensionB * dimensionC);
  else if (
    shape === "conical-frustum" &&
    dimensionB !== undefined &&
    dimensionC !== undefined &&
    dimensionA >= dimensionB
  )
    result =
      Math.PI * (dimensionA ** 2 + dimensionB ** 2) +
      Math.PI *
        (dimensionA + dimensionB) *
        Math.hypot(dimensionA - dimensionB, dimensionC);
  else if (
    shape === "ellipsoid" &&
    dimensionB !== undefined &&
    dimensionC !== undefined
  )
    result = ellipsoidSurfaceArea(dimensionA, dimensionB, dimensionC);
  return result !== null && Number.isFinite(result) && result > 0
    ? result
    : null;
};

export const surfaceAreaExample = {
  input: { dimensionA: 1, shape: "sphere" },
  output: { surfaceArea: 4 * Math.PI },
} satisfies ToolExample<
  { readonly dimensionA: number; readonly shape: SurfaceShape },
  { readonly surfaceArea: number }
>;

export const surfaceAreaTool = createSimpleTool({
  id: "geometry/surface-area",
  title: "3D Shape Surface Area Calculator",
  description:
    "Calculate total exterior surface area for common three-dimensional shapes, using the Knud Thomsen approximation for ellipsoids.",
  inputs: [
    {
      enum: [
        "sphere",
        "cone",
        "cube",
        "cylinder",
        "rectangular-prism",
        "capsule",
        "spherical-cap",
        "conical-frustum",
        "ellipsoid",
        "square-pyramid",
      ],
      id: "shape",
      kind: "string",
      label: "Shape",
    },
    { id: "dimensionA", kind: "number", label: "Dimension A", minimum: 0 },
    {
      id: "dimensionB",
      kind: "number",
      label: "Dimension B",
      minimum: 0,
      required: false,
    },
    {
      id: "dimensionC",
      kind: "number",
      label: "Dimension C",
      minimum: 0,
      required: false,
    },
  ],
  outputs: [{ id: "surfaceArea", kind: "number", label: "Surface area" }],
  calculate: (input) => {
    const surfaceArea = calculateSurfaceArea(
      input.shape as SurfaceShape,
      input.dimensionA as number,
      input.dimensionB as number | undefined,
      input.dimensionC as number | undefined,
    );
    if (surfaceArea === null)
      simpleError(
        "shape",
        "Enter the dimensions required by the selected shape.",
      );
    return { surfaceArea };
  },
});

export const runSurfaceArea = surfaceAreaTool.execute;
export default surfaceAreaTool;
