import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstHalf: number;
  readonly secondHalf: number;
  readonly stagger: number;
  readonly speed: number;
};
export type Output = {
  readonly crossingDistance: number;
  readonly walkingSeconds: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstHalf: { type: "number", minimum: 0 },
    secondHalf: { type: "number", minimum: 0 },
    stagger: { type: "number" },
    speed: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firstHalf", "secondHalf", "stagger", "speed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    crossingDistance: { type: "number" },
    walkingSeconds: { type: "number" },
  },
  required: ["crossingDistance", "walkingSeconds"],
} as const;
/** Orthogonal crossing legs and a separate signed median stagger; excludes waiting time. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstHalf, secondHalf, stagger, speed } = request;
  const compute = (): Output => {
    H.domain(firstHalf >= 0 && secondHalf >= 0);
    H.positive(speed);
    return {
      crossingDistance: firstHalf + secondHalf + Math.abs(stagger),
      walkingSeconds: (firstHalf + secondHalf + Math.abs(stagger)) / speed,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstHalf: 6, secondHalf: 7, stagger: 3, speed: 1 },
  output: { crossingDistance: 16, walkingSeconds: 16 },
} satisfies ToolExample<Input, Output>;
export const pedestrianRefugeStaggeredCrossingOffsetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "urban-planning/pedestrian-refuge-staggered-crossing-offset",
      title: "Pedestrian Refuge Staggered Crossing Offset Tool",
      description:
        "Orthogonal crossing legs and a separate signed median stagger; excludes waiting time.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          firstHalf: { type: "number", minimum: 0 },
          secondHalf: { type: "number", minimum: 0 },
          stagger: { type: "number" },
          speed: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["firstHalf", "secondHalf", "stagger", "speed"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          crossingDistance: { type: "number" },
          walkingSeconds: { type: "number" },
        },
        required: ["crossingDistance", "walkingSeconds"],
      },
      ports: {
        inputs: [
          {
            id: "firstHalf",
            label: "First Half",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "secondHalf",
            label: "Second Half",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "stagger",
            label: "Stagger",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "speed",
            label: "Speed",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "crossingDistance",
            label: "Crossing Distance",
            valueType: { type: "number" },
          },
          {
            id: "walkingSeconds",
            label: "Walking Seconds",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = pedestrianRefugeStaggeredCrossingOffsetTool.execute;
export default pedestrianRefugeStaggeredCrossingOffsetTool;
