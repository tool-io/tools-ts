import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fish: number;
  readonly netLength: number;
  readonly netHeight: number;
  readonly hours: number;
  readonly activeFraction: number;
};
export type Output = {
  readonly areaTimeEffort: number;
  readonly catchPerAreaHour: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fish: { type: "integer", minimum: 0 },
    netLength: { type: "number", exclusiveMinimum: 0 },
    netHeight: { type: "number", exclusiveMinimum: 0 },
    hours: { type: "number", exclusiveMinimum: 0 },
    activeFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: ["fish", "netLength", "netHeight", "hours", "activeFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    areaTimeEffort: { type: "number" },
    catchPerAreaHour: { type: "number" },
  },
  required: ["areaTimeEffort", "catchPerAreaHour"],
} as const;
/** Observed gillnet catch per nominal active net-area time, without selectivity or abundance correction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fish, netLength, netHeight, hours, activeFraction } = request;
  const compute = (): Output => {
    H.integer(fish, 0);
    H.positive(netLength);
    H.positive(netHeight);
    H.positive(hours);
    H.domain(activeFraction > 0 && activeFraction <= 1);
    return {
      areaTimeEffort: netLength * netHeight * hours * activeFraction,
      catchPerAreaHour: fish / (netLength * netHeight * hours * activeFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    fish: 40,
    netLength: 20,
    netHeight: 2,
    hours: 5,
    activeFraction: 0.5,
  },
  output: { areaTimeEffort: 100, catchPerAreaHour: 0.4 },
} satisfies ToolExample<Input, Output>;
export const gillnetCatchPerAreaHourTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ichthyology/gillnet-catch-per-area-hour-term",
    title: "Gillnet Catch Per Area Hour Term Tool",
    description:
      "Observed gillnet catch per nominal active net-area time, without selectivity or abundance correction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fish: { type: "integer", minimum: 0 },
        netLength: { type: "number", exclusiveMinimum: 0 },
        netHeight: { type: "number", exclusiveMinimum: 0 },
        hours: { type: "number", exclusiveMinimum: 0 },
        activeFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
      },
      required: ["fish", "netLength", "netHeight", "hours", "activeFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        areaTimeEffort: { type: "number" },
        catchPerAreaHour: { type: "number" },
      },
      required: ["areaTimeEffort", "catchPerAreaHour"],
    },
    ports: {
      inputs: [
        {
          id: "fish",
          label: "Fish",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "netLength",
          label: "Net Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "netHeight",
          label: "Net Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "hours",
          label: "Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "activeFraction",
          label: "Active Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "areaTimeEffort",
          label: "Area Time Effort",
          valueType: { type: "number" },
        },
        {
          id: "catchPerAreaHour",
          label: "Catch Per Area Hour",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = gillnetCatchPerAreaHourTermTool.execute;
export default gillnetCatchPerAreaHourTermTool;
