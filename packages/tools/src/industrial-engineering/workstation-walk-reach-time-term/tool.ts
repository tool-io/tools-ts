import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly walkDistance: number;
  readonly walkSpeed: number;
  readonly reaches: number;
  readonly timePerReach: number;
  readonly concurrentMinutes: number;
};
export type Output = {
  readonly walkMinutes: number;
  readonly reachMinutes: number;
  readonly combinedMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    walkDistance: { type: "number", minimum: 0 },
    walkSpeed: { type: "number", exclusiveMinimum: 0 },
    reaches: { type: "integer", minimum: 0 },
    timePerReach: { type: "number", minimum: 0 },
    concurrentMinutes: { type: "number", minimum: 0 },
  },
  required: [
    "walkDistance",
    "walkSpeed",
    "reaches",
    "timePerReach",
    "concurrentMinutes",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    walkMinutes: { type: "number" },
    reachMinutes: { type: "number" },
    combinedMinutes: { type: "number" },
  },
  required: ["walkMinutes", "reachMinutes", "combinedMinutes"],
} as const;
/** Calculate workstation walk reach time term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { walkDistance, walkSpeed, reaches, timePerReach, concurrentMinutes } =
    request;
  const compute = (): Output => {
    H.domain(
      walkDistance >= 0 &&
        timePerReach >= 0 &&
        concurrentMinutes >= 0 &&
        concurrentMinutes <=
          Math.min(walkDistance / walkSpeed, reaches * timePerReach),
    );
    H.positive(walkSpeed);
    H.integer(reaches, 0);
    return {
      walkMinutes: walkDistance / walkSpeed,
      reachMinutes: reaches * timePerReach,
      combinedMinutes:
        walkDistance / walkSpeed + reaches * timePerReach - concurrentMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    walkDistance: 20,
    walkSpeed: 40,
    reaches: 10,
    timePerReach: 0.02,
    concurrentMinutes: 0.1,
  },
  output: { walkMinutes: 0.5, reachMinutes: 0.2, combinedMinutes: 0.6 },
} satisfies ToolExample<Input, Output>;
export const workstationWalkReachTimeTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-engineering/workstation-walk-reach-time-term",
    title: "Workstation Walk Reach Time Term Tool",
    description:
      "Calculate workstation walk reach time term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        walkDistance: { type: "number", minimum: 0 },
        walkSpeed: { type: "number", exclusiveMinimum: 0 },
        reaches: { type: "integer", minimum: 0 },
        timePerReach: { type: "number", minimum: 0 },
        concurrentMinutes: { type: "number", minimum: 0 },
      },
      required: [
        "walkDistance",
        "walkSpeed",
        "reaches",
        "timePerReach",
        "concurrentMinutes",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        walkMinutes: { type: "number" },
        reachMinutes: { type: "number" },
        combinedMinutes: { type: "number" },
      },
      required: ["walkMinutes", "reachMinutes", "combinedMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "walkDistance",
          label: "Walk Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "walkSpeed",
          label: "Walk Speed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reaches",
          label: "Reaches",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "timePerReach",
          label: "Time Per Reach",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "concurrentMinutes",
          label: "Concurrent Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
      ],
      outputs: [
        {
          id: "walkMinutes",
          label: "Walk Minutes",
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "reachMinutes",
          label: "Reach Minutes",
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "combinedMinutes",
          label: "Combined Minutes",
          valueType: { type: "number", unit: "min" },
        },
      ],
    },
  },
  calculate,
});
export const run = workstationWalkReachTimeTermTool.execute;
export default workstationWalkReachTimeTermTool;
