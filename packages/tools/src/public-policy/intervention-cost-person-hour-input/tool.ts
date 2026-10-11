import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly personCount: number;
  readonly hoursPerPerson: number;
  readonly suppliedCostPerHour: number;
};
export type Output = {
  readonly personHours: number;
  readonly totalCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    personCount: { type: "integer", minimum: 0 },
    hoursPerPerson: { type: "number", minimum: 0 },
    suppliedCostPerHour: { type: "number", minimum: 0 },
  },
  required: ["personCount", "hoursPerPerson", "suppliedCostPerHour"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    personHours: { type: "number" },
    totalCost: { type: "number" },
  },
  required: ["personHours", "totalCost"],
} as const;
/** Calculate explicit intervention person-hours and supplied hourly cost without estimating outcomes or economic value. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { personCount, hoursPerPerson, suppliedCostPerHour } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(personCount) &&
        personCount >= 0 &&
        personCount <= Number.MAX_SAFE_INTEGER,
      "personCount",
    ),
      personCount);
    H.domain(hoursPerPerson >= 0 && suppliedCostPerHour >= 0, "hoursPerPerson");
    return {
      personHours: personCount * hoursPerPerson,
      totalCost: personCount * hoursPerPerson * suppliedCostPerHour,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { personCount: 20, hoursPerPerson: 3, suppliedCostPerHour: 15 },
  output: { personHours: 60, totalCost: 900 },
} satisfies ToolExample<Input, Output>;
export const interventionCostPersonHourInputTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["public-policy", "public policy", "social sciences"],
      keywords: ["public policy", "social sciences"],
    },
    id: "public-policy/intervention-cost-person-hour-input",
    title: "Intervention Cost Person Hour Input",
    description:
      "Calculate explicit intervention person-hours and supplied hourly cost without estimating outcomes or economic value.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        personCount: { type: "integer", minimum: 0 },
        hoursPerPerson: { type: "number", minimum: 0 },
        suppliedCostPerHour: { type: "number", minimum: 0 },
      },
      required: ["personCount", "hoursPerPerson", "suppliedCostPerHour"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        personHours: { type: "number" },
        totalCost: { type: "number" },
      },
      required: ["personHours", "totalCost"],
    },
    ports: {
      inputs: [
        {
          id: "personCount",
          label: "Person Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "hoursPerPerson",
          label: "Hours Per Person",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedCostPerHour",
          label: "Supplied Cost Per Hour",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "personHours",
          label: "Person Hours",
          valueType: { type: "number" },
        },
        { id: "totalCost", label: "Total Cost", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = interventionCostPersonHourInputTool.execute;
export default interventionCostPersonHourInputTool;
