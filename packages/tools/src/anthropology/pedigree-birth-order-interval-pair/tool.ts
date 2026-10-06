import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly earlierBirthYear: number;
  readonly laterBirthYear: number;
  readonly earlierOrder: number;
  readonly laterOrder: number;
};
export type Output = { readonly yearGap: number; readonly orderGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    earlierBirthYear: { type: "integer" },
    laterBirthYear: { type: "integer" },
    earlierOrder: { type: "integer", minimum: 1 },
    laterOrder: { type: "integer" },
  },
  required: [
    "earlierBirthYear",
    "laterBirthYear",
    "earlierOrder",
    "laterOrder",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { yearGap: { type: "integer" }, orderGap: { type: "integer" } },
  required: ["yearGap", "orderGap"],
} as const;
/** Compare explicit pedigree birth-year and birth-order fields without inferring kinship or age from incomplete dates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { earlierBirthYear, laterBirthYear, earlierOrder, laterOrder } =
    request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(earlierBirthYear) &&
        earlierBirthYear >= -Number.MAX_SAFE_INTEGER &&
        earlierBirthYear <= Number.MAX_SAFE_INTEGER,
      "earlierBirthYear",
    ),
      earlierBirthYear);
    (H.domain(
      Number.isSafeInteger(laterBirthYear) &&
        laterBirthYear >= earlierBirthYear &&
        laterBirthYear <= Number.MAX_SAFE_INTEGER,
      "laterBirthYear",
    ),
      laterBirthYear);
    (H.domain(
      Number.isSafeInteger(earlierOrder) &&
        earlierOrder >= 1 &&
        earlierOrder <= Number.MAX_SAFE_INTEGER,
      "earlierOrder",
    ),
      earlierOrder);
    (H.domain(
      Number.isSafeInteger(laterOrder) &&
        laterOrder >= earlierOrder &&
        laterOrder <= Number.MAX_SAFE_INTEGER,
      "laterOrder",
    ),
      laterOrder);
    return {
      yearGap: Number(BigInt(laterBirthYear) - BigInt(earlierBirthYear)),
      orderGap: laterOrder - earlierOrder,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    earlierBirthYear: 1990,
    laterBirthYear: 1994,
    earlierOrder: 1,
    laterOrder: 3,
  },
  output: { yearGap: 4, orderGap: 2 },
} satisfies ToolExample<Input, Output>;
export const pedigreeBirthOrderIntervalPairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["anthropology", "social sciences"],
      keywords: ["anthropology", "social sciences"],
    },
    id: "anthropology/pedigree-birth-order-interval-pair",
    title: "Pedigree Birth Order Interval Pair",
    description:
      "Compare explicit pedigree birth-year and birth-order fields without inferring kinship or age from incomplete dates.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        earlierBirthYear: { type: "integer" },
        laterBirthYear: { type: "integer" },
        earlierOrder: { type: "integer", minimum: 1 },
        laterOrder: { type: "integer" },
      },
      required: [
        "earlierBirthYear",
        "laterBirthYear",
        "earlierOrder",
        "laterOrder",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        yearGap: { type: "integer" },
        orderGap: { type: "integer" },
      },
      required: ["yearGap", "orderGap"],
    },
    ports: {
      inputs: [
        {
          id: "earlierBirthYear",
          label: "Earlier Birth Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "laterBirthYear",
          label: "Later Birth Year",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "earlierOrder",
          label: "Earlier Order",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "laterOrder",
          label: "Later Order",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "yearGap", label: "Year Gap", valueType: { type: "integer" } },
        { id: "orderGap", label: "Order Gap", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = pedigreeBirthOrderIntervalPairTool.execute;
export default pedigreeBirthOrderIntervalPairTool;
