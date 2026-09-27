import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly warrants: number;
  readonly exercisePrice: number;
};
export type Output = { readonly cashInflow: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    warrants: { type: "integer", minimum: 0 },
    exercisePrice: { type: "number", minimum: 0 },
  },
  required: ["warrants", "exercisePrice"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { cashInflow: { type: "number" } },
  required: ["cashInflow"],
} as const;
/** Calculate warrant exercise cash inflow term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { warrants, exercisePrice } = request;
  const compute = (): Output => {
    H.integer(warrants, 0);
    H.domain(exercisePrice >= 0);
    return { cashInflow: warrants * exercisePrice };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { warrants: 200, exercisePrice: 12.5 },
  output: { cashInflow: 2500 },
} satisfies ToolExample<Input, Output>;
export const warrantExerciseCashInflowTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "finance/warrant-exercise-cash-inflow-term",
    title: "Warrant Exercise Cash Inflow Term Tool",
    description:
      "Calculate warrant exercise cash inflow term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        warrants: { type: "integer", minimum: 0 },
        exercisePrice: { type: "number", minimum: 0 },
      },
      required: ["warrants", "exercisePrice"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { cashInflow: { type: "number" } },
      required: ["cashInflow"],
    },
    ports: {
      inputs: [
        {
          id: "warrants",
          label: "Warrants",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "exercisePrice",
          label: "Exercise Price",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "cashInflow",
          label: "Cash Inflow",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = warrantExerciseCashInflowTermTool.execute;
export default warrantExerciseCashInflowTermTool;
