import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previousTotal: number;
  readonly currentTotal: number;
  readonly reset: boolean;
};
export type Output = { readonly increment: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previousTotal: { type: "number" },
    currentTotal: { type: "number" },
    reset: { type: "boolean" },
  },
  required: ["previousTotal", "currentTotal", "reset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { increment: { type: "number" } },
  required: ["increment"],
} as const;
/** Calculate cumulative sum reset boundary delta from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previousTotal, currentTotal, reset } = request;
  const compute = (): Output => {
    return { increment: reset ? currentTotal : currentTotal - previousTotal };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { previousTotal: 100, currentTotal: 20, reset: true },
  output: { increment: 20 },
} satisfies ToolExample<Input, Output>;
export const cumulativeSumResetBoundaryDeltaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sequence/cumulative-sum-reset-boundary-delta",
    title: "Cumulative Sum Reset Boundary Delta Tool",
    description:
      "Calculate cumulative sum reset boundary delta from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previousTotal: { type: "number" },
        currentTotal: { type: "number" },
        reset: { type: "boolean" },
      },
      required: ["previousTotal", "currentTotal", "reset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { increment: { type: "number" } },
      required: ["increment"],
    },
    ports: {
      inputs: [
        {
          id: "previousTotal",
          label: "Previous Total",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "currentTotal",
          label: "Current Total",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reset",
          label: "Reset",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "increment", label: "Increment", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cumulativeSumResetBoundaryDeltaTool.execute;
export default cumulativeSumResetBoundaryDeltaTool;
