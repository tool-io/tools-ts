import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly registered: number;
  readonly cancellations: number;
  readonly staffMeals: number;
  readonly complimentary: number;
};
export type Output = { readonly guests: number; readonly totalMeals: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    registered: { type: "integer", minimum: 0 },
    cancellations: { type: "integer", minimum: 0 },
    staffMeals: { type: "integer", minimum: 0 },
    complimentary: { type: "integer", minimum: 0 },
  },
  required: ["registered", "cancellations", "staffMeals", "complimentary"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { guests: { type: "integer" }, totalMeals: { type: "integer" } },
  required: ["guests", "totalMeals"],
} as const;
/** Calculate event food service net cover count from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { registered, cancellations, staffMeals, complimentary } = request;
  const compute = (): Output => {
    H.integer(registered, 0);
    H.integer(cancellations, 0, registered);
    H.integer(staffMeals, 0);
    H.integer(complimentary, 0);
    return {
      guests: registered - cancellations + complimentary,
      totalMeals: registered - cancellations + complimentary + staffMeals,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { registered: 100, cancellations: 5, staffMeals: 8, complimentary: 3 },
  output: { guests: 98, totalMeals: 106 },
} satisfies ToolExample<Input, Output>;
export const eventFoodServiceNetCoverCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospitality/event-food-service-net-cover-count",
    title: "Event Food Service Net Cover Count Tool",
    description:
      "Calculate event food service net cover count from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        registered: { type: "integer", minimum: 0 },
        cancellations: { type: "integer", minimum: 0 },
        staffMeals: { type: "integer", minimum: 0 },
        complimentary: { type: "integer", minimum: 0 },
      },
      required: ["registered", "cancellations", "staffMeals", "complimentary"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        guests: { type: "integer" },
        totalMeals: { type: "integer" },
      },
      required: ["guests", "totalMeals"],
    },
    ports: {
      inputs: [
        {
          id: "registered",
          label: "Registered",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "cancellations",
          label: "Cancellations",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "staffMeals",
          label: "Staff Meals",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "complimentary",
          label: "Complimentary",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "guests", label: "Guests", valueType: { type: "integer" } },
        {
          id: "totalMeals",
          label: "Total Meals",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = eventFoodServiceNetCoverCountTool.execute;
export default eventFoodServiceNetCoverCountTool;
