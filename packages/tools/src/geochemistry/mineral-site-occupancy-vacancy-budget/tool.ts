import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly siteCapacity: number;
  readonly occupancies: readonly number[];
};
export type Output = {
  readonly occupied: number;
  readonly vacancies: number;
  readonly overfilled: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    siteCapacity: { type: "number", minimum: 0 },
    occupancies: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["siteCapacity", "occupancies"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    occupied: { type: "number" },
    vacancies: { type: "number" },
    overfilled: { type: "boolean" },
  },
  required: ["occupied", "vacancies", "overfilled"],
} as const;
/** Calculate mineral site occupancy vacancy budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { siteCapacity, occupancies } = request;
  const compute = (): Output => {
    H.domain(siteCapacity >= 0 && occupancies.every((x) => x >= 0));
    return {
      occupied: occupancies.reduce((a, b) => a + b, 0),
      vacancies: siteCapacity - occupancies.reduce((a, b) => a + b, 0),
      overfilled: occupancies.reduce((a, b) => a + b, 0) > siteCapacity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { siteCapacity: 4, occupancies: [1.5, 2] },
  output: { occupied: 3.5, vacancies: 0.5, overfilled: false },
} satisfies ToolExample<Input, Output>;
export const mineralSiteOccupancyVacancyBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geochemistry/mineral-site-occupancy-vacancy-budget",
    title: "Mineral Site Occupancy Vacancy Budget Tool",
    description:
      "Calculate mineral site occupancy vacancy budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        siteCapacity: { type: "number", minimum: 0 },
        occupancies: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
      },
      required: ["siteCapacity", "occupancies"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        occupied: { type: "number" },
        vacancies: { type: "number" },
        overfilled: { type: "boolean" },
      },
      required: ["occupied", "vacancies", "overfilled"],
    },
    ports: {
      inputs: [
        {
          id: "siteCapacity",
          label: "Site Capacity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "occupancies",
          label: "Occupancies",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        { id: "occupied", label: "Occupied", valueType: { type: "number" } },
        { id: "vacancies", label: "Vacancies", valueType: { type: "number" } },
        {
          id: "overfilled",
          label: "Overfilled",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = mineralSiteOccupancyVacancyBudgetTool.execute;
export default mineralSiteOccupancyVacancyBudgetTool;
