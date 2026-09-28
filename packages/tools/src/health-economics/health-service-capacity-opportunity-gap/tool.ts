import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly availableHours: number;
  readonly hoursPerNewPatient: number;
  readonly newPatients: number;
  readonly displacedValuePerHour: number;
};
export type Output = {
  readonly hoursNeeded: number;
  readonly excessHours: number;
  readonly displacedValue: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableHours: { type: "number", minimum: 0 },
    hoursPerNewPatient: { type: "number", minimum: 0 },
    newPatients: { type: "integer", minimum: 0 },
    displacedValuePerHour: { type: "number", minimum: 0 },
  },
  required: [
    "availableHours",
    "hoursPerNewPatient",
    "newPatients",
    "displacedValuePerHour",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    hoursNeeded: { type: "number" },
    excessHours: { type: "number" },
    displacedValue: { type: "number" },
  },
  required: ["hoursNeeded", "excessHours", "displacedValue"],
} as const;
/** Static capacity shortfall valued at an explicit opportunity cost; no safe staffing or service eligibility rule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    availableHours,
    hoursPerNewPatient,
    newPatients,
    displacedValuePerHour,
  } = request;
  const compute = (): Output => {
    H.domain(
      availableHours >= 0 &&
        hoursPerNewPatient >= 0 &&
        displacedValuePerHour >= 0,
    );
    H.integer(newPatients, 0);
    return {
      hoursNeeded: hoursPerNewPatient * newPatients,
      excessHours: Math.max(
        0,
        hoursPerNewPatient * newPatients - availableHours,
      ),
      displacedValue:
        Math.max(0, hoursPerNewPatient * newPatients - availableHours) *
        displacedValuePerHour,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    availableHours: 100,
    hoursPerNewPatient: 2,
    newPatients: 60,
    displacedValuePerHour: 50,
  },
  output: { hoursNeeded: 120, excessHours: 20, displacedValue: 1000 },
} satisfies ToolExample<Input, Output>;
export const healthServiceCapacityOpportunityGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "health-economics/health-service-capacity-opportunity-gap",
      title: "Health Service Capacity Opportunity Gap Tool",
      description:
        "Static capacity shortfall valued at an explicit opportunity cost; no safe staffing or service eligibility rule.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          availableHours: { type: "number", minimum: 0 },
          hoursPerNewPatient: { type: "number", minimum: 0 },
          newPatients: { type: "integer", minimum: 0 },
          displacedValuePerHour: { type: "number", minimum: 0 },
        },
        required: [
          "availableHours",
          "hoursPerNewPatient",
          "newPatients",
          "displacedValuePerHour",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          hoursNeeded: { type: "number" },
          excessHours: { type: "number" },
          displacedValue: { type: "number" },
        },
        required: ["hoursNeeded", "excessHours", "displacedValue"],
      },
      ports: {
        inputs: [
          {
            id: "availableHours",
            label: "Available Hours",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "hoursPerNewPatient",
            label: "Hours Per New Patient",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "newPatients",
            label: "New Patients",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "displacedValuePerHour",
            label: "Displaced Value Per Hour",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "hoursNeeded",
            label: "Hours Needed",
            valueType: { type: "number" },
          },
          {
            id: "excessHours",
            label: "Excess Hours",
            valueType: { type: "number" },
          },
          {
            id: "displacedValue",
            label: "Displaced Value",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = healthServiceCapacityOpportunityGapTool.execute;
export default healthServiceCapacityOpportunityGapTool;
