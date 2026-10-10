import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly budget: number;
  readonly actualToDate: number;
  readonly forecastRemaining: number;
};
export type Output = {
  readonly forecastTotal: number;
  readonly budgetRemainingAfterForecast: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    budget: { type: "number", minimum: 0 },
    actualToDate: { type: "number", minimum: 0 },
    forecastRemaining: { type: "number", minimum: 0 },
  },
  required: ["budget", "actualToDate", "forecastRemaining"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    forecastTotal: { type: "number" },
    budgetRemainingAfterForecast: { type: "number" },
  },
  required: ["forecastTotal", "budgetRemainingAfterForecast"],
} as const;
/** Compare an explicit actual-plus-remaining cost forecast with budget on the same currency basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { budget, actualToDate, forecastRemaining } = request;
  const compute = (): Output => {
    H.domain(
      budget >= 0 && actualToDate >= 0 && forecastRemaining >= 0,
      "budget",
    );
    return {
      forecastTotal: actualToDate + forecastRemaining,
      budgetRemainingAfterForecast: budget - actualToDate - forecastRemaining,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { budget: 1000, actualToDate: 400, forecastRemaining: 500 },
  output: { forecastTotal: 900, budgetRemainingAfterForecast: 100 },
} satisfies ToolExample<Input, Output>;
export const projectBudgetForecastResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["management", "business and finance"],
      keywords: ["management", "business and finance"],
    },
    id: "management/project-budget-forecast-residual",
    title: "Project Budget Forecast Residual",
    description:
      "Compare an explicit actual-plus-remaining cost forecast with budget on the same currency basis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        budget: { type: "number", minimum: 0 },
        actualToDate: { type: "number", minimum: 0 },
        forecastRemaining: { type: "number", minimum: 0 },
      },
      required: ["budget", "actualToDate", "forecastRemaining"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        forecastTotal: { type: "number" },
        budgetRemainingAfterForecast: { type: "number" },
      },
      required: ["forecastTotal", "budgetRemainingAfterForecast"],
    },
    ports: {
      inputs: [
        {
          id: "budget",
          label: "Budget",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "actualToDate",
          label: "Actual To Date",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "forecastRemaining",
          label: "Forecast Remaining",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "forecastTotal",
          label: "Forecast Total",
          valueType: { type: "number" },
        },
        {
          id: "budgetRemainingAfterForecast",
          label: "Budget Remaining After Forecast",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = projectBudgetForecastResidualTool.execute;
export default projectBudgetForecastResidualTool;
