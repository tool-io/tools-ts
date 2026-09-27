import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly availableMass: number;
  readonly reservedMass: number;
  readonly people: number;
  readonly suppliedDailyMass: number;
};
export type Output = {
  readonly usableMass: number;
  readonly daysCover: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableMass: { type: "number", minimum: 0 },
    reservedMass: { type: "number", minimum: 0 },
    people: { type: "integer", minimum: 1 },
    suppliedDailyMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["availableMass", "reservedMass", "people", "suppliedDailyMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { usableMass: { type: "number" }, daysCover: { type: "number" } },
  required: ["usableMass", "daysCover"],
} as const;
/** Calculate household food stock days cover factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { availableMass, reservedMass, people, suppliedDailyMass } = request;
  const compute = (): Output => {
    H.domain(
      availableMass >= 0 && reservedMass >= 0 && reservedMass <= availableMass,
    );
    H.integer(people, 1);
    H.positive(suppliedDailyMass);
    return {
      usableMass: availableMass - reservedMass,
      daysCover: (availableMass - reservedMass) / (people * suppliedDailyMass),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    availableMass: 100,
    reservedMass: 10,
    people: 3,
    suppliedDailyMass: 0.5,
  },
  output: { usableMass: 90, daysCover: 60 },
} satisfies ToolExample<Input, Output>;
export const householdFoodStockDaysCoverFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-security/household-food-stock-days-cover-factor",
    title: "Household Food Stock Days Cover Factor Tool",
    description:
      "Calculate household food stock days cover factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableMass: { type: "number", minimum: 0 },
        reservedMass: { type: "number", minimum: 0 },
        people: { type: "integer", minimum: 1 },
        suppliedDailyMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "availableMass",
        "reservedMass",
        "people",
        "suppliedDailyMass",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        usableMass: { type: "number" },
        daysCover: { type: "number" },
      },
      required: ["usableMass", "daysCover"],
    },
    ports: {
      inputs: [
        {
          id: "availableMass",
          label: "Available Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reservedMass",
          label: "Reserved Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "people",
          label: "People",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedDailyMass",
          label: "Supplied Daily Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "usableMass",
          label: "Usable Mass",
          valueType: { type: "number" },
        },
        { id: "daysCover", label: "Days Cover", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = householdFoodStockDaysCoverFactorTool.execute;
export default householdFoodStockDaysCoverFactorTool;
