import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sphere: number;
  readonly cylinder: number;
  readonly axisDegrees: number;
};
export type Output = {
  readonly sphere: number;
  readonly cylinder: number;
  readonly axisDegrees: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sphere: { type: "number" },
    cylinder: { type: "number" },
    axisDegrees: { type: "number" },
  },
  required: ["sphere", "cylinder", "axisDegrees"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sphere: { type: "number" },
    cylinder: { type: "number" },
    axisDegrees: { type: "number" },
  },
  required: ["sphere", "cylinder", "axisDegrees"],
} as const;
/** Algebraic sphero-cylinder transposition with axis normalized to [0,180), not a prescription recommendation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sphere, cylinder, axisDegrees } = request;
  const compute = (): Output => {
    const r = axisDegrees % 180,
      normalized = r < 0 ? r + 180 : r,
      axis = (normalized + 90) % 180;
    return {
      sphere: sphere + cylinder,
      cylinder: -cylinder,
      axisDegrees: axis,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sphere: -2, cylinder: -1, axisDegrees: 20 },
  output: { sphere: -3, cylinder: 1, axisDegrees: 110 },
} satisfies ToolExample<Input, Output>;
export const lensTranspositionCylinderAxisWrapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "optometry/lens-transposition-cylinder-axis-wrap",
    title: "Lens Transposition Cylinder Axis Wrap Tool",
    description:
      "Algebraic sphero-cylinder transposition with axis normalized to [0,180), not a prescription recommendation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sphere: { type: "number" },
        cylinder: { type: "number" },
        axisDegrees: { type: "number" },
      },
      required: ["sphere", "cylinder", "axisDegrees"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sphere: { type: "number" },
        cylinder: { type: "number" },
        axisDegrees: { type: "number" },
      },
      required: ["sphere", "cylinder", "axisDegrees"],
    },
    ports: {
      inputs: [
        {
          id: "sphere",
          label: "Sphere",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cylinder",
          label: "Cylinder",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "axisDegrees",
          label: "Axis Degrees",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "sphere", label: "Sphere", valueType: { type: "number" } },
        { id: "cylinder", label: "Cylinder", valueType: { type: "number" } },
        {
          id: "axisDegrees",
          label: "Axis Degrees",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = lensTranspositionCylinderAxisWrapTool.execute;
export default lensTranspositionCylinderAxisWrapTool;
