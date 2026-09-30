import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly previous: number;
  readonly current: number;
  readonly counterModulus: number;
  readonly resetOccurred: boolean;
};
export type Output = { readonly increment: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    previous: { type: "integer", minimum: 0 },
    current: { type: "integer", minimum: 0 },
    counterModulus: { type: "integer", minimum: 1 },
    resetOccurred: { type: "boolean" },
  },
  required: ["previous", "current", "counterModulus", "resetOccurred"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { increment: { type: "integer" } },
  required: ["increment"],
} as const;
/** One explicitly indicated wrapping event-counter increment, not inferred organism growth or an implicit reset detection rule. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { previous, current, counterModulus, resetOccurred } = request;
  const compute = (): Output => {
    H.integer(counterModulus, 1);
    H.integer(previous, 0, counterModulus - 1);
    H.integer(current, 0, counterModulus - 1);
    H.domain(resetOccurred || current >= previous);
    return {
      increment: resetOccurred
        ? counterModulus - previous + current
        : current - previous,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    previous: 90,
    current: 10,
    counterModulus: 100,
    resetOccurred: true,
  },
  output: { increment: 20 },
} satisfies ToolExample<Input, Output>;
export const microbialDiaryCounterResetGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "microbiology/microbial-diary-counter-reset-gap",
    title: "Microbial Diary Counter Reset Gap Tool",
    description:
      "One explicitly indicated wrapping event-counter increment, not inferred organism growth or an implicit reset detection rule.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        previous: { type: "integer", minimum: 0 },
        current: { type: "integer", minimum: 0 },
        counterModulus: { type: "integer", minimum: 1 },
        resetOccurred: { type: "boolean" },
      },
      required: ["previous", "current", "counterModulus", "resetOccurred"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { increment: { type: "integer" } },
      required: ["increment"],
    },
    ports: {
      inputs: [
        {
          id: "previous",
          label: "Previous",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "current",
          label: "Current",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "counterModulus",
          label: "Counter Modulus",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "resetOccurred",
          label: "Reset Occurred",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "increment", label: "Increment", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = microbialDiaryCounterResetGapTool.execute;
export default microbialDiaryCounterResetGapTool;
