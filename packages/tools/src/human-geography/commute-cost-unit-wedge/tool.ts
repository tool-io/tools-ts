import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstCost: number;
  readonly firstTrips: number;
  readonly secondCost: number;
  readonly secondTrips: number;
};
export type Output = {
  readonly firstPerTrip: number;
  readonly secondPerTrip: number;
  readonly wedge: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstCost: { type: "number" },
    firstTrips: { type: "number", exclusiveMinimum: 0 },
    secondCost: { type: "number" },
    secondTrips: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["firstCost", "firstTrips", "secondCost", "secondTrips"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstPerTrip: { type: "number" },
    secondPerTrip: { type: "number" },
    wedge: { type: "number" },
  },
  required: ["firstPerTrip", "secondPerTrip", "wedge"],
} as const;
/** Calculate commute cost unit wedge from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstCost, firstTrips, secondCost, secondTrips } = request;
  const compute = (): Output => {
    H.positive(firstTrips);
    H.positive(secondTrips);
    return {
      firstPerTrip: firstCost / firstTrips,
      secondPerTrip: secondCost / secondTrips,
      wedge: firstCost / firstTrips - secondCost / secondTrips,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstCost: 30, firstTrips: 10, secondCost: 20, secondTrips: 10 },
  output: { firstPerTrip: 3, secondPerTrip: 2, wedge: 1 },
} satisfies ToolExample<Input, Output>;
export const commuteCostUnitWedgeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "human-geography/commute-cost-unit-wedge",
    title: "Commute Cost Unit Wedge Tool",
    description:
      "Calculate commute cost unit wedge from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstCost: { type: "number" },
        firstTrips: { type: "number", exclusiveMinimum: 0 },
        secondCost: { type: "number" },
        secondTrips: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["firstCost", "firstTrips", "secondCost", "secondTrips"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstPerTrip: { type: "number" },
        secondPerTrip: { type: "number" },
        wedge: { type: "number" },
      },
      required: ["firstPerTrip", "secondPerTrip", "wedge"],
    },
    ports: {
      inputs: [
        {
          id: "firstCost",
          label: "First Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstTrips",
          label: "First Trips",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondCost",
          label: "Second Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondTrips",
          label: "Second Trips",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "firstPerTrip",
          label: "First Per Trip",
          valueType: { type: "number" },
        },
        {
          id: "secondPerTrip",
          label: "Second Per Trip",
          valueType: { type: "number" },
        },
        { id: "wedge", label: "Wedge", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = commuteCostUnitWedgeTool.execute;
export default commuteCostUnitWedgeTool;
