import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstMass: number;
  readonly secondMass: number;
  readonly firstVelocity: number;
  readonly secondVelocity: number;
};
export type Output = {
  readonly centerVelocity: number;
  readonly firstRelative: number;
  readonly secondRelative: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstMass: { type: "number", exclusiveMinimum: 0 },
    secondMass: { type: "number", exclusiveMinimum: 0 },
    firstVelocity: { type: "number" },
    secondVelocity: { type: "number" },
  },
  required: ["firstMass", "secondMass", "firstVelocity", "secondVelocity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    centerVelocity: { type: "number" },
    firstRelative: { type: "number" },
    secondRelative: { type: "number" },
  },
  required: ["centerVelocity", "firstRelative", "secondRelative"],
} as const;
/** Resolve a one-dimensional two-body state into its common center-of-mass velocity and signed relative velocities. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { firstMass, secondMass, firstVelocity, secondVelocity } = input;
  const compute = (): Output => {
    H.positive(firstMass);
    H.positive(secondMass);
    const centerVelocity =
      (firstMass * firstVelocity + secondMass * secondVelocity) /
      (firstMass + secondMass);
    return {
      centerVelocity,
      firstRelative: firstVelocity - centerVelocity,
      secondRelative: secondVelocity - centerVelocity,
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { firstMass: 1, secondMass: 1, firstVelocity: 3, secondVelocity: 1 },
  output: { centerVelocity: 2, firstRelative: 1, secondRelative: -1 },
} satisfies ToolExample<Input, Output>;
export const elasticCollisionCenterFrameSpeedPointTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "physics/elastic-collision-center-frame-speed-point",
      title: "Elastic Collision Center Frame Speed Point Tool",
      description:
        "Resolve a one-dimensional two-body state into its common center-of-mass velocity and signed relative velocities.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstMass: { type: "number", exclusiveMinimum: 0 },
          secondMass: { type: "number", exclusiveMinimum: 0 },
          firstVelocity: { type: "number" },
          secondVelocity: { type: "number" },
        },
        required: [
          "firstMass",
          "secondMass",
          "firstVelocity",
          "secondVelocity",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          centerVelocity: { type: "number" },
          firstRelative: { type: "number" },
          secondRelative: { type: "number" },
        },
        required: ["centerVelocity", "firstRelative", "secondRelative"],
      },
      ports: {
        inputs: [
          {
            id: "firstMass",
            label: "First Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondMass",
            label: "Second Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "firstVelocity",
            label: "First Velocity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondVelocity",
            label: "Second Velocity",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "centerVelocity",
            label: "Center Velocity",
            valueType: { type: "number" },
          },
          {
            id: "firstRelative",
            label: "First Relative",
            valueType: { type: "number" },
          },
          {
            id: "secondRelative",
            label: "Second Relative",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = elasticCollisionCenterFrameSpeedPointTool.execute;
export default elasticCollisionCenterFrameSpeedPointTool;
