import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly animalCount: number; readonly days: number };
export type Output = { readonly animalDays: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    animalCount: { type: "integer", minimum: 0 },
    days: { type: "number", minimum: 0 },
  },
  required: ["animalCount", "days"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { animalDays: { type: "number" } },
  required: ["animalDays"],
} as const;
/** Compute animal-day occupancy for a constant explicitly recorded pen population, allowing fractional observed days. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { animalCount, days } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(animalCount) &&
        animalCount >= 0 &&
        animalCount <= Number.MAX_SAFE_INTEGER,
      "animalCount",
    ),
      animalCount);
    H.domain(days >= 0, "days");
    return { animalDays: animalCount * days };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { animalCount: 12, days: 7 },
  output: { animalDays: 84 },
} satisfies ToolExample<Input, Output>;
export const livestockPenAnimalDayCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["animal-science", "animal science", "agriculture"],
      keywords: ["animal science", "agriculture"],
    },
    id: "animal-science/livestock-pen-animal-day-count",
    title: "Livestock Pen Animal Day Count",
    description:
      "Compute animal-day occupancy for a constant explicitly recorded pen population, allowing fractional observed days.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        animalCount: { type: "integer", minimum: 0 },
        days: { type: "number", minimum: 0 },
      },
      required: ["animalCount", "days"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { animalDays: { type: "number" } },
      required: ["animalDays"],
    },
    ports: {
      inputs: [
        {
          id: "animalCount",
          label: "Animal Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "days",
          label: "Days",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "animalDays",
          label: "Animal Days",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = livestockPenAnimalDayCountTool.execute;
export default livestockPenAnimalDayCountTool;
