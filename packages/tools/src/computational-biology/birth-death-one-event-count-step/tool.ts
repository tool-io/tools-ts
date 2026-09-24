import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly count: number;
  readonly event: string;
  readonly amount: number;
};
export type Output = { readonly nextCount: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: { type: "integer", minimum: 0 },
    event: { type: "string", maxLength: 8192, enum: ["birth", "death"] },
    amount: { type: "integer", minimum: 0 },
  },
  required: ["count", "event", "amount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { nextCount: { type: "integer" } },
  required: ["nextCount"],
} as const;
/** Apply a supplied discrete count event; no stochastic event time or event type is sampled. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { count, event, amount } = request;
  const compute = (): Output => {
    H.integer(count, 0);
    H.integer(amount, 0);
    H.domain(["birth", "death"].includes(event));
    H.domain(event !== "death" || amount <= count);
    return { nextCount: count + (event === "birth" ? amount : -amount) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { count: 10, event: "birth", amount: 3 },
  output: { nextCount: 13 },
} satisfies ToolExample<Input, Output>;
export const birthDeathOneEventCountStepTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-biology/birth-death-one-event-count-step",
    title: "Birth Death One Event Count Step Tool",
    description:
      "Apply a supplied discrete count event; no stochastic event time or event type is sampled.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        count: { type: "integer", minimum: 0 },
        event: { type: "string", maxLength: 8192, enum: ["birth", "death"] },
        amount: { type: "integer", minimum: 0 },
      },
      required: ["count", "event", "amount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { nextCount: { type: "integer" } },
      required: ["nextCount"],
    },
    ports: {
      inputs: [
        {
          id: "count",
          label: "Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "event",
          label: "Event",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "amount",
          label: "Amount",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "nextCount",
          label: "Next Count",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = birthDeathOneEventCountStepTool.execute;
export default birthDeathOneEventCountStepTool;
