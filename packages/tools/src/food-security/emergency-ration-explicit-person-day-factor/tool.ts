import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly people: number;
  readonly days: number;
  readonly suppliedDailyMass: number;
  readonly existingMass: number;
};
export type Output = {
  readonly personDays: number;
  readonly requiredMass: number;
  readonly procurementGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    people: { type: "integer", minimum: 0 },
    days: { type: "number", minimum: 0 },
    suppliedDailyMass: { type: "number", minimum: 0 },
    existingMass: { type: "number", minimum: 0 },
  },
  required: ["people", "days", "suppliedDailyMass", "existingMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    personDays: { type: "number" },
    requiredMass: { type: "number" },
    procurementGap: { type: "number" },
  },
  required: ["personDays", "requiredMass", "procurementGap"],
} as const;
/** Inventory arithmetic using an explicitly supplied ration mass, without a dietary adequacy claim. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { people, days, suppliedDailyMass, existingMass } = request;
  const compute = (): Output => {
    H.integer(people, 0);
    H.domain(days >= 0 && suppliedDailyMass >= 0 && existingMass >= 0);
    return {
      personDays: people * days,
      requiredMass: people * days * suppliedDailyMass,
      procurementGap: Math.max(
        0,
        people * days * suppliedDailyMass - existingMass,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { people: 100, days: 3, suppliedDailyMass: 0.5, existingMass: 50 },
  output: { personDays: 300, requiredMass: 150, procurementGap: 100 },
} satisfies ToolExample<Input, Output>;
export const emergencyRationExplicitPersonDayFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "food-security/emergency-ration-explicit-person-day-factor",
      title: "Emergency Ration Explicit Person Day Factor Tool",
      description:
        "Inventory arithmetic using an explicitly supplied ration mass, without a dietary adequacy claim.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          people: { type: "integer", minimum: 0 },
          days: { type: "number", minimum: 0 },
          suppliedDailyMass: { type: "number", minimum: 0 },
          existingMass: { type: "number", minimum: 0 },
        },
        required: ["people", "days", "suppliedDailyMass", "existingMass"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          personDays: { type: "number" },
          requiredMass: { type: "number" },
          procurementGap: { type: "number" },
        },
        required: ["personDays", "requiredMass", "procurementGap"],
      },
      ports: {
        inputs: [
          {
            id: "people",
            label: "People",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "days",
            label: "Days",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedDailyMass",
            label: "Supplied Daily Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "existingMass",
            label: "Existing Mass",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "personDays",
            label: "Person Days",
            valueType: { type: "number" },
          },
          {
            id: "requiredMass",
            label: "Required Mass",
            valueType: { type: "number" },
          },
          {
            id: "procurementGap",
            label: "Procurement Gap",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = emergencyRationExplicitPersonDayFactorTool.execute;
export default emergencyRationExplicitPersonDayFactorTool;
