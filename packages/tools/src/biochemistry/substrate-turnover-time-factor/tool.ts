import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly turnoverRate: number; readonly elapsed: number };
export type Output = { readonly expectedTurnovers: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    turnoverRate: { type: "number", minimum: 0 },
    elapsed: { type: "number", minimum: 0 },
  },
  required: ["turnoverRate", "elapsed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { expectedTurnovers: { type: "number" } },
  required: ["expectedTurnovers"],
} as const;
/** Multiply a supplied constant per-time turnover rate by compatible elapsed time. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { turnoverRate, elapsed } = request;
  const compute = (): Output => {
    H.domain(turnoverRate >= 0 && elapsed >= 0);
    return { expectedTurnovers: turnoverRate * elapsed };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { turnoverRate: 3, elapsed: 4 },
  output: { expectedTurnovers: 12 },
} satisfies ToolExample<Input, Output>;
export const substrateTurnoverTimeFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biochemistry/substrate-turnover-time-factor",
    title: "Substrate Turnover Time Factor Tool",
    description:
      "Multiply a supplied constant per-time turnover rate by compatible elapsed time.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        turnoverRate: { type: "number", minimum: 0 },
        elapsed: { type: "number", minimum: 0 },
      },
      required: ["turnoverRate", "elapsed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { expectedTurnovers: { type: "number" } },
      required: ["expectedTurnovers"],
    },
    ports: {
      inputs: [
        {
          id: "turnoverRate",
          label: "Turnover Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "elapsed",
          label: "Elapsed",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "expectedTurnovers",
          label: "Expected Turnovers",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = substrateTurnoverTimeFactorTool.execute;
export default substrateTurnoverTimeFactorTool;
