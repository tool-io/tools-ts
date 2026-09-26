import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly grossGrams: number;
  readonly fineness: number;
  readonly wearGrams: number;
};
export type Output = { readonly fineGrams: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossGrams: { type: "number", minimum: 0 },
    fineness: { type: "number", minimum: 0, maximum: 1 },
    wearGrams: { type: "number", minimum: 0 },
  },
  required: ["grossGrams", "fineness", "wearGrams"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fineGrams: { type: "number" } },
  required: ["fineGrams"],
} as const;
/** Calculate coin metal content fineness term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { grossGrams, fineness, wearGrams } = request;
  const compute = (): Output => {
    H.domain(grossGrams >= 0 && wearGrams >= 0 && wearGrams <= grossGrams);
    H.probability(fineness);
    return { fineGrams: (grossGrams - wearGrams) * fineness };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { grossGrams: 10, fineness: 0.9, wearGrams: 1 },
  output: { fineGrams: 8.1 },
} satisfies ToolExample<Input, Output>;
export const coinMetalContentFinenessTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "economic-history/coin-metal-content-fineness-term",
    title: "Coin Metal Content Fineness Term Tool",
    description:
      "Calculate coin metal content fineness term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossGrams: { type: "number", minimum: 0 },
        fineness: { type: "number", minimum: 0, maximum: 1 },
        wearGrams: { type: "number", minimum: 0 },
      },
      required: ["grossGrams", "fineness", "wearGrams"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { fineGrams: { type: "number" } },
      required: ["fineGrams"],
    },
    ports: {
      inputs: [
        {
          id: "grossGrams",
          label: "Gross Grams",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fineness",
          label: "Fineness",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wearGrams",
          label: "Wear Grams",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fineGrams", label: "Fine Grams", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = coinMetalContentFinenessTermTool.execute;
export default coinMetalContentFinenessTermTool;
