import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly vested: number;
  readonly exercised: number;
  readonly strike: number;
  readonly taxWithheld: number;
};
export type Output = {
  readonly grossCash: number;
  readonly netCash: number;
  readonly unexercised: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    vested: { type: "integer", minimum: 0 },
    exercised: { type: "integer", minimum: 0 },
    strike: { type: "number", minimum: 0 },
    taxWithheld: { type: "number", minimum: 0 },
  },
  required: ["vested", "exercised", "strike", "taxWithheld"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossCash: { type: "number" },
    netCash: { type: "number" },
    unexercised: { type: "integer" },
  },
  required: ["grossCash", "netCash", "unexercised"],
} as const;
/** Calculate option exercise cash inflow one grant from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { vested, exercised, strike, taxWithheld } = request;
  const compute = (): Output => {
    H.integer(vested, 0);
    H.integer(exercised, 0, vested);
    H.domain(strike >= 0 && taxWithheld >= 0);
    return {
      grossCash: exercised * strike,
      netCash: exercised * strike - taxWithheld,
      unexercised: vested - exercised,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { vested: 10000, exercised: 4000, strike: 2, taxWithheld: 1000 },
  output: { grossCash: 8000, netCash: 7000, unexercised: 6000 },
} satisfies ToolExample<Input, Output>;
export const optionExerciseCashInflowOneGrantTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entrepreneurship-studies/option-exercise-cash-inflow-one-grant",
    title: "Option Exercise Cash Inflow One Grant Tool",
    description:
      "Calculate option exercise cash inflow one grant from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        vested: { type: "integer", minimum: 0 },
        exercised: { type: "integer", minimum: 0 },
        strike: { type: "number", minimum: 0 },
        taxWithheld: { type: "number", minimum: 0 },
      },
      required: ["vested", "exercised", "strike", "taxWithheld"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossCash: { type: "number" },
        netCash: { type: "number" },
        unexercised: { type: "integer" },
      },
      required: ["grossCash", "netCash", "unexercised"],
    },
    ports: {
      inputs: [
        {
          id: "vested",
          label: "Vested",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "exercised",
          label: "Exercised",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "strike",
          label: "Strike",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "taxWithheld",
          label: "Tax Withheld",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "grossCash", label: "Gross Cash", valueType: { type: "number" } },
        { id: "netCash", label: "Net Cash", valueType: { type: "number" } },
        {
          id: "unexercised",
          label: "Unexercised",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = optionExerciseCashInflowOneGrantTool.execute;
export default optionExerciseCashInflowOneGrantTool;
