import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sharedTotal: number;
  readonly diners: number;
  readonly personalItems: number;
  readonly serviceFraction: number;
};
export type Output = {
  readonly sharedShare: number;
  readonly personDue: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sharedTotal: { type: "number", minimum: 0 },
    diners: { type: "integer", minimum: 1 },
    personalItems: { type: "number", minimum: 0 },
    serviceFraction: { type: "number", minimum: 0 },
  },
  required: ["sharedTotal", "diners", "personalItems", "serviceFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sharedShare: { type: "number" },
    personDue: { type: "number" },
  },
  required: ["sharedShare", "personDue"],
} as const;
/** Calculate restaurant split bill fixed item share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sharedTotal, diners, personalItems, serviceFraction } = request;
  const compute = (): Output => {
    H.integer(diners, 1);
    H.domain(sharedTotal >= 0 && personalItems >= 0 && serviceFraction >= 0);
    return {
      sharedShare: sharedTotal / diners,
      personDue: (sharedTotal / diners + personalItems) * (1 + serviceFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    sharedTotal: 120,
    diners: 4,
    personalItems: 10,
    serviceFraction: 0.1,
  },
  output: { sharedShare: 30, personDue: 44 },
} satisfies ToolExample<Input, Output>;
export const restaurantSplitBillFixedItemShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospitality/restaurant-split-bill-fixed-item-share",
    title: "Restaurant Split Bill Fixed Item Share Tool",
    description:
      "Calculate restaurant split bill fixed item share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sharedTotal: { type: "number", minimum: 0 },
        diners: { type: "integer", minimum: 1 },
        personalItems: { type: "number", minimum: 0 },
        serviceFraction: { type: "number", minimum: 0 },
      },
      required: ["sharedTotal", "diners", "personalItems", "serviceFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sharedShare: { type: "number" },
        personDue: { type: "number" },
      },
      required: ["sharedShare", "personDue"],
    },
    ports: {
      inputs: [
        {
          id: "sharedTotal",
          label: "Shared Total",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "diners",
          label: "Diners",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "personalItems",
          label: "Personal Items",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "serviceFraction",
          label: "Service Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "sharedShare",
          label: "Shared Share",
          valueType: { type: "number" },
        },
        { id: "personDue", label: "Person Due", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = restaurantSplitBillFixedItemShareTool.execute;
export default restaurantSplitBillFixedItemShareTool;
