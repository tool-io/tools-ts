import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly radial: number;
  readonly azimuthal: number;
  readonly vertical: number;
  readonly azimuthRadians: number;
};
export type Output = { readonly cartesian: readonly number[] };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radial: { type: "number" },
    azimuthal: { type: "number" },
    vertical: { type: "number" },
    azimuthRadians: { type: "number" },
  },
  required: ["radial", "azimuthal", "vertical", "azimuthRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cartesian: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["cartesian"],
} as const;
/** Transform vector components in the local cylindrical basis to Cartesian components at an explicit azimuth. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { radial, azimuthal, vertical, azimuthRadians } = request;
  const compute = (): Output => {
    return {
      cartesian: [
        radial * Math.cos(azimuthRadians) -
          azimuthal * Math.sin(azimuthRadians),
        radial * Math.sin(azimuthRadians) +
          azimuthal * Math.cos(azimuthRadians),
        vertical,
      ],
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { radial: 3, azimuthal: 4, vertical: 5, azimuthRadians: 0 },
  output: { cartesian: [3, 4, 5] },
} satisfies ToolExample<Input, Output>;
export const vectorCylindricalBasisAzimuthTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vector/vector-cylindrical-basis-azimuth-term",
    title: "Vector Cylindrical Basis Azimuth Term Tool",
    description:
      "Transform vector components in the local cylindrical basis to Cartesian components at an explicit azimuth.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        radial: { type: "number" },
        azimuthal: { type: "number" },
        vertical: { type: "number" },
        azimuthRadians: { type: "number" },
      },
      required: ["radial", "azimuthal", "vertical", "azimuthRadians"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cartesian: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["cartesian"],
    },
    ports: {
      inputs: [
        {
          id: "radial",
          label: "Radial",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "azimuthal",
          label: "Azimuthal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "vertical",
          label: "Vertical",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "azimuthRadians",
          label: "Azimuth Radians",
          required: true,
          valueType: { type: "number", unit: "rad" },
        },
      ],
      outputs: [
        {
          id: "cartesian",
          label: "Cartesian",
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
    },
  },
  calculate,
});
export const run = vectorCylindricalBasisAzimuthTermTool.execute;
export default vectorCylindricalBasisAzimuthTermTool;
