import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly availableMinutes: number;
  readonly demand: number;
  readonly cycleMinutes: number;
};
export type Output = {
  readonly taktMinutes: number;
  readonly slackMinutes: number;
  readonly capacityAtCycle: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableMinutes: { type: "number", minimum: 0 },
    demand: { type: "integer", minimum: 1 },
    cycleMinutes: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["availableMinutes", "demand", "cycleMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    taktMinutes: { type: "number" },
    slackMinutes: { type: "number" },
    capacityAtCycle: { type: "number" },
  },
  required: ["taktMinutes", "slackMinutes", "capacityAtCycle"],
} as const;
/** Calculate takt cycle slack per unit from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { availableMinutes, demand, cycleMinutes } = request;
  const compute = (): Output => {
    H.domain(availableMinutes >= 0);
    H.integer(demand, 1);
    H.positive(cycleMinutes);
    return {
      taktMinutes: availableMinutes / demand,
      slackMinutes: availableMinutes / demand - cycleMinutes,
      capacityAtCycle: availableMinutes / cycleMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { availableMinutes: 420, demand: 210, cycleMinutes: 1.8 },
  output: {
    taktMinutes: 2,
    slackMinutes: 0.19999999999999996,
    capacityAtCycle: 233.33333333333331,
  },
} satisfies ToolExample<Input, Output>;
export const taktCycleSlackPerUnitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-engineering/takt-cycle-slack-per-unit",
    title: "Takt Cycle Slack Per Unit Tool",
    description:
      "Calculate takt cycle slack per unit from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableMinutes: { type: "number", minimum: 0 },
        demand: { type: "integer", minimum: 1 },
        cycleMinutes: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["availableMinutes", "demand", "cycleMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        taktMinutes: { type: "number" },
        slackMinutes: { type: "number" },
        capacityAtCycle: { type: "number" },
      },
      required: ["taktMinutes", "slackMinutes", "capacityAtCycle"],
    },
    ports: {
      inputs: [
        {
          id: "availableMinutes",
          label: "Available Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "demand",
          label: "Demand",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "cycleMinutes",
          label: "Cycle Minutes",
          required: true,
          valueType: { type: "number", unit: "min" },
        },
      ],
      outputs: [
        {
          id: "taktMinutes",
          label: "Takt Minutes",
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "slackMinutes",
          label: "Slack Minutes",
          valueType: { type: "number", unit: "min" },
        },
        {
          id: "capacityAtCycle",
          label: "Capacity At Cycle",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = taktCycleSlackPerUnitTool.execute;
export default taktCycleSlackPerUnitTool;
