import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly matchWeight: number;
  readonly firstTotal: number;
  readonly secondTotal: number;
};
export type Output = { readonly contribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    matchWeight: { type: "number", minimum: 0 },
    firstTotal: { type: "number", minimum: 0 },
    secondTotal: { type: "number", minimum: 0 },
  },
  required: ["matchWeight", "firstTotal", "secondTotal"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { contribution: { type: "number" } },
  required: ["contribution"],
} as const;
/** Calculate dice weighted match one term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { matchWeight, firstTotal, secondTotal } = request;
  const compute = (): Output => {
    H.domain(
      matchWeight >= 0 &&
        firstTotal >= 0 &&
        secondTotal >= 0 &&
        matchWeight <= Math.min(firstTotal, secondTotal),
    );
    H.positive(firstTotal + secondTotal);
    return { contribution: (2 * matchWeight) / (firstTotal + secondTotal) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { matchWeight: 2, firstTotal: 4, secondTotal: 6 },
  output: { contribution: 0.4 },
} satisfies ToolExample<Input, Output>;
export const diceWeightedMatchOneTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "similarity/dice-weighted-match-one-term",
    title: "Dice Weighted Match One Term Tool",
    description:
      "Calculate dice weighted match one term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        matchWeight: { type: "number", minimum: 0 },
        firstTotal: { type: "number", minimum: 0 },
        secondTotal: { type: "number", minimum: 0 },
      },
      required: ["matchWeight", "firstTotal", "secondTotal"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { contribution: { type: "number" } },
      required: ["contribution"],
    },
    ports: {
      inputs: [
        {
          id: "matchWeight",
          label: "Match Weight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstTotal",
          label: "First Total",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondTotal",
          label: "Second Total",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "contribution",
          label: "Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = diceWeightedMatchOneTermTool.execute;
export default diceWeightedMatchOneTermTool;
