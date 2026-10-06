import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly busyCounterMinutes: number;
  readonly staffedCounterMinutes: number;
};
export type Output = {
  readonly utilization: number;
  readonly idleCounterMinutes: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    busyCounterMinutes: { type: "number", minimum: 0 },
    staffedCounterMinutes: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["busyCounterMinutes", "staffedCounterMinutes"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    utilization: { type: "number" },
    idleCounterMinutes: { type: "number" },
  },
  required: ["utilization", "idleCounterMinutes"],
} as const;
/** Measure counter utilization from compatible summed busy and staffed counter-minutes for one reporting interval. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { busyCounterMinutes, staffedCounterMinutes } = request;
  const compute = (): Output => {
    (H.domain(staffedCounterMinutes > 0, "staffedCounterMinutes"),
      staffedCounterMinutes);
    H.domain(
      busyCounterMinutes >= 0 && busyCounterMinutes <= staffedCounterMinutes,
      "busyCounterMinutes",
    );
    return {
      utilization: busyCounterMinutes / staffedCounterMinutes,
      idleCounterMinutes: staffedCounterMinutes - busyCounterMinutes,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { busyCounterMinutes: 210, staffedCounterMinutes: 300 },
  output: { utilization: 0.7, idleCounterMinutes: 90 },
} satisfies ToolExample<Input, Output>;
export const officeServiceCounterUtilizationTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "administrative-science",
        "administrative science",
        "business and finance",
      ],
      keywords: ["administrative science", "business and finance"],
    },
    id: "administrative-science/office-service-counter-utilization",
    title: "Office Service Counter Utilization",
    description:
      "Measure counter utilization from compatible summed busy and staffed counter-minutes for one reporting interval.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        busyCounterMinutes: { type: "number", minimum: 0 },
        staffedCounterMinutes: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["busyCounterMinutes", "staffedCounterMinutes"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        utilization: { type: "number" },
        idleCounterMinutes: { type: "number" },
      },
      required: ["utilization", "idleCounterMinutes"],
    },
    ports: {
      inputs: [
        {
          id: "busyCounterMinutes",
          label: "Busy Counter Minutes",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "staffedCounterMinutes",
          label: "Staffed Counter Minutes",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "utilization",
          label: "Utilization",
          valueType: { type: "number" },
        },
        {
          id: "idleCounterMinutes",
          label: "Idle Counter Minutes",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = officeServiceCounterUtilizationTool.execute;
export default officeServiceCounterUtilizationTool;
