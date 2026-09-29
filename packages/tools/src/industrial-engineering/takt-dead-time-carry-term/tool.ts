import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly shiftMinutes: number;
  readonly plannedDeadTime: number;
  readonly demand: number;
  readonly carriedDemand: number;
};
export type Output = {
  readonly availableMinutes: number;
  readonly totalDemand: number;
  readonly taktMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shiftMinutes: { type: "number" },
    plannedDeadTime: { type: "number", minimum: 0 },
    demand: { type: "integer", minimum: 0 },
    carriedDemand: { type: "integer", minimum: 0 },
  },
  required: ["shiftMinutes", "plannedDeadTime", "demand", "carriedDemand"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableMinutes: { type: "number" },
    totalDemand: { type: "integer" },
    taktMinutes: { type: "number" },
  },
  required: ["availableMinutes", "totalDemand", "taktMinutes"],
} as const;
/** Calculate takt dead time carry term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { shiftMinutes, plannedDeadTime, demand, carriedDemand } = request;
  const compute = (): Output => {
    H.integer(demand, 0);
    H.integer(carriedDemand, 0);
    H.domain(
      shiftMinutes >= plannedDeadTime &&
        plannedDeadTime >= 0 &&
        demand + carriedDemand > 0,
    );
    return {
      availableMinutes: shiftMinutes - plannedDeadTime,
      totalDemand: demand + carriedDemand,
      taktMinutes: (shiftMinutes - plannedDeadTime) / (demand + carriedDemand),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    shiftMinutes: 480,
    plannedDeadTime: 60,
    demand: 100,
    carriedDemand: 20,
  },
  output: { availableMinutes: 420, totalDemand: 120, taktMinutes: 3.5 },
} satisfies ToolExample<Input, Output>;
export const taktDeadTimeCarryTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-engineering/takt-dead-time-carry-term",
    title: "Takt Dead Time Carry Term Tool",
    description:
      "Calculate takt dead time carry term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shiftMinutes: { type: "number" },
        plannedDeadTime: { type: "number", minimum: 0 },
        demand: { type: "integer", minimum: 0 },
        carriedDemand: { type: "integer", minimum: 0 },
      },
      required: ["shiftMinutes", "plannedDeadTime", "demand", "carriedDemand"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableMinutes: { type: "number" },
        totalDemand: { type: "integer" },
        taktMinutes: { type: "number" },
      },
      required: ["availableMinutes", "totalDemand", "taktMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "shiftMinutes",
          label: "Shift Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "plannedDeadTime",
          label: "Planned Dead Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "demand",
          label: "Demand",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "carriedDemand",
          label: "Carried Demand",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "availableMinutes",
          label: "Available Minutes",
          valueType: { type: "number" },
        },
        {
          id: "totalDemand",
          label: "Total Demand",
          valueType: { type: "integer" },
        },
        {
          id: "taktMinutes",
          label: "Takt Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = taktDeadTimeCarryTermTool.execute;
export default taktDeadTimeCarryTermTool;
