import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly angle: number;
  readonly radiansPerSourceUnit: number;
  readonly radiansPerTargetUnit: number;
};
export type Output = { readonly convertedAngle: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    angle: { type: "number" },
    radiansPerSourceUnit: { type: "number", exclusiveMinimum: 0 },
    radiansPerTargetUnit: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["angle", "radiansPerSourceUnit", "radiansPerTargetUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { convertedAngle: { type: "number" } },
  required: ["convertedAngle"],
} as const;
/** Calculate joint motion unit factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { angle, radiansPerSourceUnit, radiansPerTargetUnit } = request;
  const compute = (): Output => {
    H.positive(radiansPerSourceUnit);
    H.positive(radiansPerTargetUnit);
    return {
      convertedAngle: (angle * radiansPerSourceUnit) / radiansPerTargetUnit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    angle: 90,
    radiansPerSourceUnit: 0.017453292519943295,
    radiansPerTargetUnit: 1,
  },
  output: { convertedAngle: 1.5707963267948966 },
} satisfies ToolExample<Input, Output>;
export const jointMotionUnitFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "rheumatology/joint-motion-unit-factor",
    title: "Joint Motion Unit Factor Tool",
    description:
      "Calculate joint motion unit factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        angle: { type: "number" },
        radiansPerSourceUnit: { type: "number", exclusiveMinimum: 0 },
        radiansPerTargetUnit: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["angle", "radiansPerSourceUnit", "radiansPerTargetUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { convertedAngle: { type: "number" } },
      required: ["convertedAngle"],
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
          id: "radiansPerSourceUnit",
          label: "Radians Per Source Unit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "radiansPerTargetUnit",
          label: "Radians Per Target Unit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "convertedAngle",
          label: "Converted Angle",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = jointMotionUnitFactorTool.execute;
export default jointMotionUnitFactorTool;
