import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly options: number;
  readonly exercisePrice: number;
  readonly fees: number;
  readonly withholding: number;
  readonly includeWithholding: boolean;
};
export type Output = {
  readonly exerciseCash: number;
  readonly totalCash: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    options: { type: "integer", minimum: 0 },
    exercisePrice: { type: "number", minimum: 0 },
    fees: { type: "number", minimum: 0 },
    withholding: { type: "number", minimum: 0 },
    includeWithholding: { type: "boolean" },
  },
  required: [
    "options",
    "exercisePrice",
    "fees",
    "withholding",
    "includeWithholding",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    exerciseCash: { type: "number" },
    totalCash: { type: "number" },
  },
  required: ["exerciseCash", "totalCash"],
} as const;
/** Calculate startup option exercise cash base from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { options, exercisePrice, fees, withholding, includeWithholding } =
    request;
  const compute = (): Output => {
    H.integer(options, 0);
    H.domain(exercisePrice >= 0 && fees >= 0 && withholding >= 0);
    return {
      exerciseCash: options * exercisePrice,
      totalCash:
        options * exercisePrice + fees + (includeWithholding ? withholding : 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    options: 100,
    exercisePrice: 2,
    fees: 10,
    withholding: 50,
    includeWithholding: true,
  },
  output: { exerciseCash: 200, totalCash: 260 },
} satisfies ToolExample<Input, Output>;
export const startupOptionExerciseCashBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entrepreneurship-studies/startup-option-exercise-cash-base",
    title: "Startup Option Exercise Cash Base Tool",
    description:
      "Calculate startup option exercise cash base from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        options: { type: "integer", minimum: 0 },
        exercisePrice: { type: "number", minimum: 0 },
        fees: { type: "number", minimum: 0 },
        withholding: { type: "number", minimum: 0 },
        includeWithholding: { type: "boolean" },
      },
      required: [
        "options",
        "exercisePrice",
        "fees",
        "withholding",
        "includeWithholding",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        exerciseCash: { type: "number" },
        totalCash: { type: "number" },
      },
      required: ["exerciseCash", "totalCash"],
    },
    ports: {
      inputs: [
        {
          id: "options",
          label: "Options",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "exercisePrice",
          label: "Exercise Price",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fees",
          label: "Fees",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "withholding",
          label: "Withholding",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includeWithholding",
          label: "Include Withholding",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "exerciseCash",
          label: "Exercise Cash",
          valueType: { type: "number" },
        },
        { id: "totalCash", label: "Total Cash", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = startupOptionExerciseCashBaseTool.execute;
export default startupOptionExerciseCashBaseTool;
