import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requiredOutput: number;
  readonly yieldFraction: number;
  readonly reserveFraction: number;
};
export type Output = { readonly feed: number; readonly reserve: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredOutput: { type: "number", minimum: 0 },
    yieldFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
    reserveFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
  },
  required: ["requiredOutput", "yieldFraction", "reserveFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { feed: { type: "number" }, reserve: { type: "number" } },
  required: ["feed", "reserve"],
} as const;
/** Calculate recovery yield inverse feed budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requiredOutput, yieldFraction, reserveFraction } = request;
  const compute = (): Output => {
    H.domain(requiredOutput >= 0);
    H.domain(yieldFraction > 0 && yieldFraction <= 1);
    H.domain(reserveFraction >= 0 && reserveFraction < 1);
    const feed = requiredOutput / (yieldFraction * (1 - reserveFraction));
    return { feed, reserve: feed * reserveFraction };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requiredOutput: 72, yieldFraction: 0.8, reserveFraction: 0.1 },
  output: { feed: 99.99999999999999, reserve: 10 },
} satisfies ToolExample<Input, Output>;
export const recoveryYieldInverseFeedBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "proportions/recovery-yield-inverse-feed-budget",
    title: "Recovery Yield Inverse Feed Budget Tool",
    description:
      "Calculate recovery yield inverse feed budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredOutput: { type: "number", minimum: 0 },
        yieldFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
        reserveFraction: { type: "number", minimum: 0, exclusiveMaximum: 1 },
      },
      required: ["requiredOutput", "yieldFraction", "reserveFraction"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { feed: { type: "number" }, reserve: { type: "number" } },
      required: ["feed", "reserve"],
    },
    ports: {
      inputs: [
        {
          id: "requiredOutput",
          label: "Required Output",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "yieldFraction",
          label: "Yield Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reserveFraction",
          label: "Reserve Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "feed", label: "Feed", valueType: { type: "number" } },
        { id: "reserve", label: "Reserve", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = recoveryYieldInverseFeedBudgetTool.execute;
export default recoveryYieldInverseFeedBudgetTool;
