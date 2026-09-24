import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly angle: number;
  readonly suppliedRadiansPerUnit: number;
  readonly unitLabel: string;
};
export type Output = { readonly radians: number; readonly sourceUnit: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    angle: { type: "number" },
    suppliedRadiansPerUnit: { type: "number", exclusiveMinimum: 0 },
    unitLabel: { type: "string", maxLength: 8192 },
  },
  required: ["angle", "suppliedRadiansPerUnit", "unitLabel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radians: { type: "number" },
    sourceUnit: { type: "string", maxLength: 8192 },
  },
  required: ["radians", "sourceUnit"],
} as const;
/** Convert a supplied angle with its explicit source-unit factor; no angular-diameter distance is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { angle, suppliedRadiansPerUnit, unitLabel } = request;
  const compute = (): Output => {
    H.positive(suppliedRadiansPerUnit);
    H.domain(unitLabel.length > 0);
    return { radians: angle * suppliedRadiansPerUnit, sourceUnit: unitLabel };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    angle: 180,
    suppliedRadiansPerUnit: 0.017453292519943295,
    unitLabel: "deg",
  },
  output: { radians: 3.141592653589793, sourceUnit: "deg" },
} satisfies ToolExample<Input, Output>;
export const cosmologicalAngleRadianBasisTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cosmology/cosmological-angle-radian-basis-token",
    title: "Cosmological Angle Radian Basis Token Tool",
    description:
      "Convert a supplied angle with its explicit source-unit factor; no angular-diameter distance is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        angle: { type: "number" },
        suppliedRadiansPerUnit: { type: "number", exclusiveMinimum: 0 },
        unitLabel: { type: "string", maxLength: 8192 },
      },
      required: ["angle", "suppliedRadiansPerUnit", "unitLabel"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        radians: { type: "number" },
        sourceUnit: { type: "string", maxLength: 8192 },
      },
      required: ["radians", "sourceUnit"],
    },
    ports: {
      inputs: [
        {
          id: "angle",
          label: "Angle",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedRadiansPerUnit",
          label: "Supplied Radians Per Unit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unitLabel",
          label: "Unit Label",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "radians", label: "Radians", valueType: { type: "number" } },
        {
          id: "sourceUnit",
          label: "Source Unit",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = cosmologicalAngleRadianBasisTokenTool.execute;
export default cosmologicalAngleRadianBasisTokenTool;
