import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stored: number;
  readonly unusable: number;
  readonly dailyUse: number;
  readonly anticipatedRain: number;
};
export type Output = { readonly available: number; readonly daysCover: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stored: { type: "number" },
    unusable: { type: "number", minimum: 0 },
    dailyUse: { type: "number", exclusiveMinimum: 0 },
    anticipatedRain: { type: "number", minimum: 0 },
  },
  required: ["stored", "unusable", "dailyUse", "anticipatedRain"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { available: { type: "number" }, daysCover: { type: "number" } },
  required: ["available", "daysCover"],
} as const;
/** Calculate rain barrel irrigation day budget term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stored, unusable, dailyUse, anticipatedRain } = request;
  const compute = (): Output => {
    H.positive(dailyUse);
    H.domain(stored >= unusable && unusable >= 0 && anticipatedRain >= 0);
    return {
      available: stored - unusable + anticipatedRain,
      daysCover: (stored - unusable + anticipatedRain) / dailyUse,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stored: 100, unusable: 10, dailyUse: 15, anticipatedRain: 0 },
  output: { available: 90, daysCover: 6 },
} satisfies ToolExample<Input, Output>;
export const rainBarrelIrrigationDayBudgetTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "urban-agriculture/rain-barrel-irrigation-day-budget-term",
    title: "Rain Barrel Irrigation Day Budget Term Tool",
    description:
      "Calculate rain barrel irrigation day budget term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stored: { type: "number" },
        unusable: { type: "number", minimum: 0 },
        dailyUse: { type: "number", exclusiveMinimum: 0 },
        anticipatedRain: { type: "number", minimum: 0 },
      },
      required: ["stored", "unusable", "dailyUse", "anticipatedRain"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        available: { type: "number" },
        daysCover: { type: "number" },
      },
      required: ["available", "daysCover"],
    },
    ports: {
      inputs: [
        {
          id: "stored",
          label: "Stored",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unusable",
          label: "Unusable",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dailyUse",
          label: "Daily Use",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "anticipatedRain",
          label: "Anticipated Rain",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "available", label: "Available", valueType: { type: "number" } },
        { id: "daysCover", label: "Days Cover", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = rainBarrelIrrigationDayBudgetTermTool.execute;
export default rainBarrelIrrigationDayBudgetTermTool;
