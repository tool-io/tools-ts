import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly scale: number; readonly offset: number };
export type Output = {
  readonly invertible: boolean;
  readonly inverseScale: number;
  readonly inverseOffset: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { scale: { type: "number" }, offset: { type: "number" } },
  required: ["scale", "offset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    invertible: { type: "boolean" },
    inverseScale: { type: "number" },
    inverseOffset: { type: "number" },
  },
  required: ["invertible", "inverseScale", "inverseOffset"],
} as const;
/** Calculate scalar affine inverse existence from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { scale, offset } = request;
  const compute = (): Output => {
    const invertible = scale !== 0;
    return {
      invertible,
      inverseScale: invertible ? 1 / scale : 0,
      inverseOffset: invertible ? -offset / scale : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { scale: 2, offset: 3 },
  output: { invertible: true, inverseScale: 0.5, inverseOffset: -1.5 },
} satisfies ToolExample<Input, Output>;
export const scalarAffineInverseExistenceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "normalize/scalar-affine-inverse-existence",
    title: "Scalar Affine Inverse Existence Tool",
    description:
      "Calculate scalar affine inverse existence from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { scale: { type: "number" }, offset: { type: "number" } },
      required: ["scale", "offset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        invertible: { type: "boolean" },
        inverseScale: { type: "number" },
        inverseOffset: { type: "number" },
      },
      required: ["invertible", "inverseScale", "inverseOffset"],
    },
    ports: {
      inputs: [
        {
          id: "scale",
          label: "Scale",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "offset",
          label: "Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "invertible",
          label: "Invertible",
          valueType: { type: "boolean" },
        },
        {
          id: "inverseScale",
          label: "Inverse Scale",
          valueType: { type: "number" },
        },
        {
          id: "inverseOffset",
          label: "Inverse Offset",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = scalarAffineInverseExistenceTool.execute;
export default scalarAffineInverseExistenceTool;
