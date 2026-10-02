import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly forwardOffset: number;
  readonly lateralOffset: number;
  readonly headingRadians: number;
};
export type Output = {
  readonly eastOffset: number;
  readonly northOffset: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    forwardOffset: { type: "number" },
    lateralOffset: { type: "number" },
    headingRadians: { type: "number" },
  },
  required: ["forwardOffset", "lateralOffset", "headingRadians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eastOffset: { type: "number" },
    northOffset: { type: "number" },
  },
  required: ["eastOffset", "northOffset"],
} as const;
/** Rotate supplied forward/right offsets using a clockwise-from-north heading. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { forwardOffset, lateralOffset, headingRadians } = request;
  const compute = (): Output => {
    return {
      eastOffset:
        forwardOffset * Math.sin(headingRadians) +
        lateralOffset * Math.cos(headingRadians),
      northOffset:
        forwardOffset * Math.cos(headingRadians) -
        lateralOffset * Math.sin(headingRadians),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { forwardOffset: 2, lateralOffset: 3, headingRadians: 0 },
  output: { eastOffset: 3, northOffset: 2 },
} satisfies ToolExample<Input, Output>;
export const implementSectionLateralOffsetRotationTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "precision-agriculture/implement-section-lateral-offset-rotation-term",
      title: "Implement Section Lateral Offset Rotation Term Tool",
      description:
        "Rotate supplied forward/right offsets using a clockwise-from-north heading.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          forwardOffset: { type: "number" },
          lateralOffset: { type: "number" },
          headingRadians: { type: "number" },
        },
        required: ["forwardOffset", "lateralOffset", "headingRadians"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          eastOffset: { type: "number" },
          northOffset: { type: "number" },
        },
        required: ["eastOffset", "northOffset"],
      },
      ports: {
        inputs: [
          {
            id: "forwardOffset",
            label: "Forward Offset",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "lateralOffset",
            label: "Lateral Offset",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "headingRadians",
            label: "Heading Radians",
            required: true,
            valueType: { type: "number", unit: "rad" },
          },
        ],
        outputs: [
          {
            id: "eastOffset",
            label: "East Offset",
            valueType: { type: "number" },
          },
          {
            id: "northOffset",
            label: "North Offset",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = implementSectionLateralOffsetRotationTermTool.execute;
export default implementSectionLateralOffsetRotationTermTool;
