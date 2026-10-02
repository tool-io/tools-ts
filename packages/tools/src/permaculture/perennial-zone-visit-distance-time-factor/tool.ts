import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly oneWayDistance: number;
  readonly visits: number;
  readonly speed: number;
  readonly taskMinutes: number;
};
export type Output = {
  readonly travelMinutes: number;
  readonly totalMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oneWayDistance: { type: "number", minimum: 0 },
    visits: { type: "integer", minimum: 0 },
    speed: { type: "number", exclusiveMinimum: 0 },
    taskMinutes: { type: "number", minimum: 0 },
  },
  required: ["oneWayDistance", "visits", "speed", "taskMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    travelMinutes: { type: "number" },
    totalMinutes: { type: "number" },
  },
  required: ["travelMinutes", "totalMinutes"],
} as const;
/** Calculate perennial zone visit distance time factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { oneWayDistance, visits, speed, taskMinutes } = request;
  const compute = (): Output => {
    H.integer(visits, 0);
    H.domain(oneWayDistance >= 0 && taskMinutes >= 0);
    H.positive(speed);
    return {
      travelMinutes: (2 * oneWayDistance * visits) / speed,
      totalMinutes:
        (2 * oneWayDistance * visits) / speed + visits * taskMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { oneWayDistance: 100, visits: 3, speed: 50, taskMinutes: 10 },
  output: { travelMinutes: 12, totalMinutes: 42 },
} satisfies ToolExample<Input, Output>;
export const perennialZoneVisitDistanceTimeFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "permaculture/perennial-zone-visit-distance-time-factor",
      title: "Perennial Zone Visit Distance Time Factor Tool",
      description:
        "Calculate perennial zone visit distance time factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          oneWayDistance: { type: "number", minimum: 0 },
          visits: { type: "integer", minimum: 0 },
          speed: { type: "number", exclusiveMinimum: 0 },
          taskMinutes: { type: "number", minimum: 0 },
        },
        required: ["oneWayDistance", "visits", "speed", "taskMinutes"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          travelMinutes: { type: "number" },
          totalMinutes: { type: "number" },
        },
        required: ["travelMinutes", "totalMinutes"],
      },
      ports: {
        inputs: [
          {
            id: "oneWayDistance",
            label: "One Way Distance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "visits",
            label: "Visits",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "speed",
            label: "Speed",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "taskMinutes",
            label: "Task Minutes",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "travelMinutes",
            label: "Travel Minutes",
            valueType: { type: "number" },
          },
          {
            id: "totalMinutes",
            label: "Total Minutes",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = perennialZoneVisitDistanceTimeFactorTool.execute;
export default perennialZoneVisitDistanceTimeFactorTool;
