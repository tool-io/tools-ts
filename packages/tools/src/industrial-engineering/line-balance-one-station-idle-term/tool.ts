import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly taskTimes: readonly number[];
  readonly cycleTime: number;
};
export type Output = {
  readonly stationLoad: number;
  readonly idleTime: number;
  readonly loadFraction: number;
  readonly overload: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    taskTimes: { type: "array", maxItems: 256, items: { type: "number" } },
    cycleTime: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["taskTimes", "cycleTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stationLoad: { type: "number" },
    idleTime: { type: "number" },
    loadFraction: { type: "number" },
    overload: { type: "boolean" },
  },
  required: ["stationLoad", "idleTime", "loadFraction", "overload"],
} as const;
/** One station load relative to supplied cycle time; no precedence-constrained line-balancing optimization. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { taskTimes, cycleTime } = request;
  const compute = (): Output => {
    H.domain(taskTimes.every((x) => x >= 0));
    H.positive(cycleTime);
    return {
      stationLoad: taskTimes.reduce((a, b) => a + b, 0),
      idleTime: cycleTime - taskTimes.reduce((a, b) => a + b, 0),
      loadFraction: taskTimes.reduce((a, b) => a + b, 0) / cycleTime,
      overload: taskTimes.reduce((a, b) => a + b, 0) > cycleTime,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { taskTimes: [2, 3, 1], cycleTime: 8 },
  output: { stationLoad: 6, idleTime: 2, loadFraction: 0.75, overload: false },
} satisfies ToolExample<Input, Output>;
export const lineBalanceOneStationIdleTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-engineering/line-balance-one-station-idle-term",
    title: "Line Balance One Station Idle Term Tool",
    description:
      "One station load relative to supplied cycle time; no precedence-constrained line-balancing optimization.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        taskTimes: { type: "array", maxItems: 256, items: { type: "number" } },
        cycleTime: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["taskTimes", "cycleTime"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stationLoad: { type: "number" },
        idleTime: { type: "number" },
        loadFraction: { type: "number" },
        overload: { type: "boolean" },
      },
      required: ["stationLoad", "idleTime", "loadFraction", "overload"],
    },
    ports: {
      inputs: [
        {
          id: "taskTimes",
          label: "Task Times",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "cycleTime",
          label: "Cycle Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "stationLoad",
          label: "Station Load",
          valueType: { type: "number" },
        },
        { id: "idleTime", label: "Idle Time", valueType: { type: "number" } },
        {
          id: "loadFraction",
          label: "Load Fraction",
          valueType: { type: "number" },
        },
        { id: "overload", label: "Overload", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = lineBalanceOneStationIdleTermTool.execute;
export default lineBalanceOneStationIdleTermTool;
