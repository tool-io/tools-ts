import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly concurrentDemand: readonly number[];
  readonly capacity: number;
};
export type Output = {
  readonly demand: number;
  readonly excess: number;
  readonly spare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    concurrentDemand: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    capacity: { type: "number", minimum: 0 },
  },
  required: ["concurrentDemand", "capacity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    demand: { type: "number" },
    excess: { type: "number" },
    spare: { type: "number" },
  },
  required: ["demand", "excess", "spare"],
} as const;
/** Calculate task overlap capacity excess from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { concurrentDemand, capacity } = request;
  const compute = (): Output => {
    H.domain(capacity >= 0 && concurrentDemand.every((x) => x >= 0));
    return {
      demand: concurrentDemand.reduce((a, b) => a + b, 0),
      excess: Math.max(
        0,
        concurrentDemand.reduce((a, b) => a + b, 0) - capacity,
      ),
      spare: Math.max(
        0,
        capacity - concurrentDemand.reduce((a, b) => a + b, 0),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { concurrentDemand: [3, 4], capacity: 5 },
  output: { demand: 7, excess: 2, spare: 0 },
} satisfies ToolExample<Input, Output>;
export const taskOverlapCapacityExcessTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "management/task-overlap-capacity-excess",
    title: "Task Overlap Capacity Excess Tool",
    description:
      "Calculate task overlap capacity excess from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        concurrentDemand: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        capacity: { type: "number", minimum: 0 },
      },
      required: ["concurrentDemand", "capacity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        demand: { type: "number" },
        excess: { type: "number" },
        spare: { type: "number" },
      },
      required: ["demand", "excess", "spare"],
    },
    ports: {
      inputs: [
        {
          id: "concurrentDemand",
          label: "Concurrent Demand",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "capacity",
          label: "Capacity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "demand", label: "Demand", valueType: { type: "number" } },
        { id: "excess", label: "Excess", valueType: { type: "number" } },
        { id: "spare", label: "Spare", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = taskOverlapCapacityExcessTool.execute;
export default taskOverlapCapacityExcessTool;
