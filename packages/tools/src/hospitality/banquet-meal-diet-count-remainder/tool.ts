import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly totalMeals: number;
  readonly separatelyAllocatedDietMeals: readonly number[];
};
export type Output = { readonly remainingMeals: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    totalMeals: { type: "integer", minimum: 0 },
    separatelyAllocatedDietMeals: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["totalMeals", "separatelyAllocatedDietMeals"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { remainingMeals: { type: "integer" } },
  required: ["remainingMeals"],
} as const;
/** Subtract explicitly nonoverlapping diet-meal allocations from a banquet total, retaining over-allocation as a negative remainder. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { totalMeals, separatelyAllocatedDietMeals } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(totalMeals) &&
        totalMeals >= 0 &&
        totalMeals <= Number.MAX_SAFE_INTEGER,
      "totalMeals",
    ),
      totalMeals);
    return {
      remainingMeals: (() => {
        separatelyAllocatedDietMeals.forEach(
          (value) => (
            H.domain(
              Number.isSafeInteger(value) &&
                value >= 0 &&
                value <= Number.MAX_SAFE_INTEGER,
              "separatelyAllocatedDietMeals",
            ),
            value
          ),
        );
        return Number(
          BigInt(totalMeals) -
            separatelyAllocatedDietMeals.reduce(
              (sum, value) => sum + BigInt(value),
              0n,
            ),
        );
      })(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { totalMeals: 100, separatelyAllocatedDietMeals: [10, 15] },
  output: { remainingMeals: 75 },
} satisfies ToolExample<Input, Output>;
export const banquetMealDietCountRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["hospitality", "business and finance"],
      keywords: ["hospitality", "business and finance"],
    },
    id: "hospitality/banquet-meal-diet-count-remainder",
    title: "Banquet Meal Diet Count Remainder",
    description:
      "Subtract explicitly nonoverlapping diet-meal allocations from a banquet total, retaining over-allocation as a negative remainder.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        totalMeals: { type: "integer", minimum: 0 },
        separatelyAllocatedDietMeals: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["totalMeals", "separatelyAllocatedDietMeals"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { remainingMeals: { type: "integer" } },
      required: ["remainingMeals"],
    },
    ports: {
      inputs: [
        {
          id: "totalMeals",
          label: "Total Meals",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "separatelyAllocatedDietMeals",
          label: "Separately Allocated Diet Meals",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "remainingMeals",
          label: "Remaining Meals",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = banquetMealDietCountRemainderTool.execute;
export default banquetMealDietCountRemainderTool;
