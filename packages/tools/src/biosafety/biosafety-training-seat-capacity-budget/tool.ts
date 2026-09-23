import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sessions: number;
  readonly seats: number;
  readonly instructors: number;
  readonly maximumPerInstructor: number;
  readonly reservations: number;
};
export type Output = {
  readonly physicalCapacity: number;
  readonly instructionalCapacity: number;
  readonly available: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sessions: { type: "integer", minimum: 0 },
    seats: { type: "integer", minimum: 0 },
    instructors: { type: "integer", minimum: 0 },
    maximumPerInstructor: { type: "integer", minimum: 0 },
    reservations: { type: "integer", minimum: 0 },
  },
  required: [
    "sessions",
    "seats",
    "instructors",
    "maximumPerInstructor",
    "reservations",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    physicalCapacity: { type: "integer" },
    instructionalCapacity: { type: "integer" },
    available: { type: "integer" },
  },
  required: ["physicalCapacity", "instructionalCapacity", "available"],
} as const;
/** Calculate biosafety training seat capacity budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sessions, seats, instructors, maximumPerInstructor, reservations } =
    request;
  const compute = (): Output => {
    H.integer(sessions, 0);
    H.integer(seats, 0);
    H.integer(instructors, 0);
    H.integer(maximumPerInstructor, 0);
    H.integer(reservations, 0);
    return {
      physicalCapacity: sessions * seats,
      instructionalCapacity: sessions * instructors * maximumPerInstructor,
      available:
        Math.min(
          sessions * seats,
          sessions * instructors * maximumPerInstructor,
        ) - reservations,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sessions: 3,
    seats: 20,
    instructors: 2,
    maximumPerInstructor: 8,
    reservations: 30,
  },
  output: { physicalCapacity: 60, instructionalCapacity: 48, available: 18 },
} satisfies ToolExample<Input, Output>;
export const biosafetyTrainingSeatCapacityBudgetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biosafety/biosafety-training-seat-capacity-budget",
      title: "Biosafety Training Seat Capacity Budget Tool",
      description:
        "Calculate biosafety training seat capacity budget from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          sessions: { type: "integer", minimum: 0 },
          seats: { type: "integer", minimum: 0 },
          instructors: { type: "integer", minimum: 0 },
          maximumPerInstructor: { type: "integer", minimum: 0 },
          reservations: { type: "integer", minimum: 0 },
        },
        required: [
          "sessions",
          "seats",
          "instructors",
          "maximumPerInstructor",
          "reservations",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          physicalCapacity: { type: "integer" },
          instructionalCapacity: { type: "integer" },
          available: { type: "integer" },
        },
        required: ["physicalCapacity", "instructionalCapacity", "available"],
      },
      ports: {
        inputs: [
          {
            id: "sessions",
            label: "Sessions",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "seats",
            label: "Seats",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "instructors",
            label: "Instructors",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "maximumPerInstructor",
            label: "Maximum Per Instructor",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "reservations",
            label: "Reservations",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "physicalCapacity",
            label: "Physical Capacity",
            valueType: { type: "integer" },
          },
          {
            id: "instructionalCapacity",
            label: "Instructional Capacity",
            valueType: { type: "integer" },
          },
          {
            id: "available",
            label: "Available",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = biosafetyTrainingSeatCapacityBudgetTool.execute;
export default biosafetyTrainingSeatCapacityBudgetTool;
