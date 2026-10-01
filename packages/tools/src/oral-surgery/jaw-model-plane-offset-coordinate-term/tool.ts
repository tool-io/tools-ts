import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly nx: number;
  readonly ny: number;
  readonly nz: number;
  readonly offset: number;
  readonly translation: number;
};
export type Output = {
  readonly signedDistance: number;
  readonly shiftedOffset: number;
  readonly shiftedDistance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    x: { type: "number" },
    y: { type: "number" },
    z: { type: "number" },
    nx: { type: "number" },
    ny: { type: "number" },
    nz: { type: "number" },
    offset: { type: "number" },
    translation: { type: "number" },
  },
  required: ["x", "y", "z", "nx", "ny", "nz", "offset", "translation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signedDistance: { type: "number" },
    shiftedOffset: { type: "number" },
    shiftedDistance: { type: "number" },
  },
  required: ["signedDistance", "shiftedOffset", "shiftedDistance"],
} as const;
/** Translate a supplied oriented plane along its unit normal and report point distances. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { x, y, z, nx, ny, nz, offset, translation } = request;
  const compute = (): Output => {
    H.domain(Math.hypot(nx, ny, nz) > 0);
    return {
      signedDistance:
        (nx * x + ny * y + nz * z - offset) / Math.hypot(nx, ny, nz),
      shiftedOffset: offset + translation * Math.hypot(nx, ny, nz),
      shiftedDistance:
        (nx * x + ny * y + nz * z - offset) / Math.hypot(nx, ny, nz) -
        translation,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { x: 2, y: 3, z: 4, nx: 0, ny: 0, nz: 2, offset: 2, translation: 1 },
  output: { signedDistance: 3, shiftedOffset: 4, shiftedDistance: 2 },
} satisfies ToolExample<Input, Output>;
export const jawModelPlaneOffsetCoordinateTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "oral-surgery/jaw-model-plane-offset-coordinate-term",
    title: "Jaw Model Plane Offset Coordinate Term Tool",
    description:
      "Translate a supplied oriented plane along its unit normal and report point distances.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        x: { type: "number" },
        y: { type: "number" },
        z: { type: "number" },
        nx: { type: "number" },
        ny: { type: "number" },
        nz: { type: "number" },
        offset: { type: "number" },
        translation: { type: "number" },
      },
      required: ["x", "y", "z", "nx", "ny", "nz", "offset", "translation"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signedDistance: { type: "number" },
        shiftedOffset: { type: "number" },
        shiftedDistance: { type: "number" },
      },
      required: ["signedDistance", "shiftedOffset", "shiftedDistance"],
    },
    ports: {
      inputs: [
        { id: "x", label: "X", required: true, valueType: { type: "number" } },
        { id: "y", label: "Y", required: true, valueType: { type: "number" } },
        { id: "z", label: "Z", required: true, valueType: { type: "number" } },
        {
          id: "nx",
          label: "Nx",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ny",
          label: "Ny",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "nz",
          label: "Nz",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "offset",
          label: "Offset",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "translation",
          label: "Translation",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "signedDistance",
          label: "Signed Distance",
          valueType: { type: "number" },
        },
        {
          id: "shiftedOffset",
          label: "Shifted Offset",
          valueType: { type: "number" },
        },
        {
          id: "shiftedDistance",
          label: "Shifted Distance",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = jawModelPlaneOffsetCoordinateTermTool.execute;
export default jawModelPlaneOffsetCoordinateTermTool;
