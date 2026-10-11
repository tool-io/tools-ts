import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly availableEach: number;
  readonly eachPerCase: number;
};
export type Output = {
  readonly wholeCases: number;
  readonly remainderEach: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableEach: { type: "integer", minimum: 0 },
    eachPerCase: { type: "integer", minimum: 1 },
  },
  required: ["availableEach", "eachPerCase"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    wholeCases: { type: "integer" },
    remainderEach: { type: "integer" },
  },
  required: ["wholeCases", "remainderEach"],
} as const;
/** Split an explicit each-unit inventory into whole cases and remainder units using exact integer division. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { availableEach, eachPerCase } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(availableEach) &&
        availableEach >= 0 &&
        availableEach <= Number.MAX_SAFE_INTEGER,
      "availableEach",
    ),
      availableEach);
    (H.domain(
      Number.isSafeInteger(eachPerCase) &&
        eachPerCase >= 1 &&
        eachPerCase <= Number.MAX_SAFE_INTEGER,
      "eachPerCase",
    ),
      eachPerCase);
    return {
      wholeCases: Number(BigInt(availableEach) / BigInt(eachPerCase)),
      remainderEach: Number(BigInt(availableEach) % BigInt(eachPerCase)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { availableEach: 105, eachPerCase: 12 },
  output: { wholeCases: 8, remainderEach: 9 },
} satisfies ToolExample<Input, Output>;
export const skuCaseEachQuantityRemainderTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["supply-chain", "supply chain", "business and finance"],
      keywords: ["supply chain", "business and finance"],
    },
    id: "supply-chain/sku-case-each-quantity-remainder",
    title: "SKU Case Each Quantity Remainder",
    description:
      "Split an explicit each-unit inventory into whole cases and remainder units using exact integer division.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableEach: { type: "integer", minimum: 0 },
        eachPerCase: { type: "integer", minimum: 1 },
      },
      required: ["availableEach", "eachPerCase"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        wholeCases: { type: "integer" },
        remainderEach: { type: "integer" },
      },
      required: ["wholeCases", "remainderEach"],
    },
    ports: {
      inputs: [
        {
          id: "availableEach",
          label: "Available Each",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "eachPerCase",
          label: "Each Per Case",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "wholeCases",
          label: "Whole Cases",
          valueType: { type: "integer" },
        },
        {
          id: "remainderEach",
          label: "Remainder Each",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = skuCaseEachQuantityRemainderTool.execute;
export default skuCaseEachQuantityRemainderTool;
