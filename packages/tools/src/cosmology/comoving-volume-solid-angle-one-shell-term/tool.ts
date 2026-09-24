import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly transverseComovingDistance: number;
  readonly radialComovingThickness: number;
  readonly solidAngleSteradians: number;
};
export type Output = { readonly shellVolume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    transverseComovingDistance: { type: "number", minimum: 0 },
    radialComovingThickness: { type: "number", minimum: 0 },
    solidAngleSteradians: { type: "number", minimum: 0 },
  },
  required: [
    "transverseComovingDistance",
    "radialComovingThickness",
    "solidAngleSteradians",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { shellVolume: { type: "number" } },
  required: ["shellVolume"],
} as const;
/** Differential thin comoving shell DM squared*dDC*dOmega, without treating a thick curved shell as a Euclidean frustum. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    transverseComovingDistance,
    radialComovingThickness,
    solidAngleSteradians,
  } = request;
  const compute = (): Output => {
    H.domain(
      transverseComovingDistance >= 0 &&
        radialComovingThickness >= 0 &&
        solidAngleSteradians >= 0 &&
        solidAngleSteradians <= 4 * Math.PI,
    );
    return {
      shellVolume:
        transverseComovingDistance ** 2 *
        radialComovingThickness *
        solidAngleSteradians,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    transverseComovingDistance: 100,
    radialComovingThickness: 2,
    solidAngleSteradians: 0.5,
  },
  output: { shellVolume: 10000 },
} satisfies ToolExample<Input, Output>;
export const comovingVolumeSolidAngleOneShellTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "cosmology/comoving-volume-solid-angle-one-shell-term",
      title: "Comoving Volume Solid Angle One Shell Term Tool",
      description:
        "Differential thin comoving shell DM squared*dDC*dOmega, without treating a thick curved shell as a Euclidean frustum.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          transverseComovingDistance: { type: "number", minimum: 0 },
          radialComovingThickness: { type: "number", minimum: 0 },
          solidAngleSteradians: { type: "number", minimum: 0 },
        },
        required: [
          "transverseComovingDistance",
          "radialComovingThickness",
          "solidAngleSteradians",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { shellVolume: { type: "number" } },
        required: ["shellVolume"],
      },
      ports: {
        inputs: [
          {
            id: "transverseComovingDistance",
            label: "Transverse Comoving Distance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "radialComovingThickness",
            label: "Radial Comoving Thickness",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "solidAngleSteradians",
            label: "Solid Angle Steradians",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "shellVolume",
            label: "Shell Volume",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = comovingVolumeSolidAngleOneShellTermTool.execute;
export default comovingVolumeSolidAngleOneShellTermTool;
