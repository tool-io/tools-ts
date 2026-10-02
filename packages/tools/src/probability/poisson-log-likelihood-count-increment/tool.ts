import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly count: number; readonly rate: number };
export type Output = { readonly increment: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    count: { type: "integer", minimum: 0 },
    rate: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["count", "rate"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { increment: { type: "number" } },
  required: ["increment"],
} as const;
/** Calculate poisson log likelihood count increment from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { count, rate } = request;
  const compute = (): Output => {
    H.integer(count, 0, Number.MAX_SAFE_INTEGER - 1);
    H.positive(rate);
    return { increment: Math.log(rate) - Math.log(count + 1) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { count: 3, rate: 8 },
  output: { increment: 0.6931471805599452 },
} satisfies ToolExample<Input, Output>;
export const poissonLogLikelihoodCountIncrementTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "probability/poisson-log-likelihood-count-increment",
    title: "Poisson Log Likelihood Count Increment Tool",
    description:
      "Calculate poisson log likelihood count increment from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        count: { type: "integer", minimum: 0 },
        rate: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["count", "rate"],
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
          id: "count",
          label: "Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "rate",
          label: "Rate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "increment", label: "Increment", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = poissonLogLikelihoodCountIncrementTool.execute;
export default poissonLogLikelihoodCountIncrementTool;
