import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly discountFactor: number;
  readonly zeroBasedPeriod: number;
};
export type Output = { readonly weight: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    discountFactor: { type: "number", minimum: 0, maximum: 1 },
    zeroBasedPeriod: { type: "integer", minimum: 0 },
  },
  required: ["discountFactor", "zeroBasedPeriod"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { weight: { type: "number" } },
  required: ["weight"],
} as const;
/** Return the period weight for a supplied geometric discount convention, including weight one in period zero. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { discountFactor, zeroBasedPeriod } = request;
  const compute = (): Output => {
    (H.domain(discountFactor >= 0 && discountFactor <= 1, "discountFactor"),
      discountFactor);
    (H.domain(
      Number.isSafeInteger(zeroBasedPeriod) &&
        zeroBasedPeriod >= 0 &&
        zeroBasedPeriod <= Number.MAX_SAFE_INTEGER,
      "zeroBasedPeriod",
    ),
      zeroBasedPeriod);
    return { weight: discountFactor ** zeroBasedPeriod };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { discountFactor: 0.5, zeroBasedPeriod: 3 },
  output: { weight: 0.125 },
} satisfies ToolExample<Input, Output>;
export const repeatedGameDiscountWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["game-theory", "game theory", "economics"],
      keywords: ["game theory", "economics"],
    },
    id: "game-theory/repeated-game-discount-weight",
    title: "Repeated Game Discount Weight",
    description:
      "Return the period weight for a supplied geometric discount convention, including weight one in period zero.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        discountFactor: { type: "number", minimum: 0, maximum: 1 },
        zeroBasedPeriod: { type: "integer", minimum: 0 },
      },
      required: ["discountFactor", "zeroBasedPeriod"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { weight: { type: "number" } },
      required: ["weight"],
    },
    ports: {
      inputs: [
        {
          id: "discountFactor",
          label: "Discount Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "zeroBasedPeriod",
          label: "Zero Based Period",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "weight", label: "Weight", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = repeatedGameDiscountWeightTool.execute;
export default repeatedGameDiscountWeightTool;
