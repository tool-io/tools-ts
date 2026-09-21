import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly midlineX: number;
};
export type Output = {
  readonly reflectedX: number;
  readonly reflectedY: number;
  readonly reflectedZ: number;
  readonly signedMidlineDistance: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    x: { type: "number" },
    y: { type: "number" },
    z: { type: "number" },
    midlineX: { type: "number" },
  },
  required: ["x", "y", "z", "midlineX"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    reflectedX: { type: "number" },
    reflectedY: { type: "number" },
    reflectedZ: { type: "number" },
    signedMidlineDistance: { type: "number" },
  },
  required: ["reflectedX", "reflectedY", "reflectedZ", "signedMidlineDistance"],
} as const;
/** Reflection across a supplied constant-x midline in one explicit coordinate frame, without assigning patient laterality from image orientation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { x, y, z, midlineX } = request;
  const compute = (): Output => {
    return {
      reflectedX: 2 * midlineX - x,
      reflectedY: y,
      reflectedZ: z,
      signedMidlineDistance: x - midlineX,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { x: 3, y: 4, z: 5, midlineX: 1 },
  output: {
    reflectedX: -1,
    reflectedY: 4,
    reflectedZ: 5,
    signedMidlineDistance: 2,
  },
} satisfies ToolExample<Input, Output>;
export const anatomicalRightLeftReflectionCoordinateTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "anatomy/anatomical-right-left-reflection-coordinate",
      title: "Anatomical Right Left Reflection Coordinate Tool",
      description:
        "Reflection across a supplied constant-x midline in one explicit coordinate frame, without assigning patient laterality from image orientation.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          x: { type: "number" },
          y: { type: "number" },
          z: { type: "number" },
          midlineX: { type: "number" },
        },
        required: ["x", "y", "z", "midlineX"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          reflectedX: { type: "number" },
          reflectedY: { type: "number" },
          reflectedZ: { type: "number" },
          signedMidlineDistance: { type: "number" },
        },
        required: [
          "reflectedX",
          "reflectedY",
          "reflectedZ",
          "signedMidlineDistance",
        ],
      },
      ports: {
        inputs: [
          {
            id: "x",
            label: "X",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "y",
            label: "Y",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "z",
            label: "Z",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "midlineX",
            label: "Midline X",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "reflectedX",
            label: "Reflected X",
            valueType: { type: "number" },
          },
          {
            id: "reflectedY",
            label: "Reflected Y",
            valueType: { type: "number" },
          },
          {
            id: "reflectedZ",
            label: "Reflected Z",
            valueType: { type: "number" },
          },
          {
            id: "signedMidlineDistance",
            label: "Signed Midline Distance",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = anatomicalRightLeftReflectionCoordinateTool.execute;
export default anatomicalRightLeftReflectionCoordinateTool;
