import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly usageBefore: number;
  readonly addedUsage: number;
  readonly blockLower: number;
  readonly blockUpper: number;
  readonly pricePerUnit: number;
};
export type Output = {
  readonly addedUsageInBlock: number;
  readonly blockCharge: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    usageBefore: { type: "number", minimum: 0 },
    addedUsage: { type: "number", minimum: 0 },
    blockLower: { type: "number", minimum: 0 },
    blockUpper: { type: "number" },
    pricePerUnit: { type: "number", minimum: 0 },
  },
  required: [
    "usageBefore",
    "addedUsage",
    "blockLower",
    "blockUpper",
    "pricePerUnit",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    addedUsageInBlock: { type: "number" },
    blockCharge: { type: "number" },
  },
  required: ["addedUsageInBlock", "blockCharge"],
} as const;
/** Price only the overlap of added usage with one explicit tariff block without constructing a complete bill. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { usageBefore, addedUsage, blockLower, blockUpper, pricePerUnit } =
    request;
  const compute = (): Output => {
    H.domain(
      usageBefore >= 0 &&
        addedUsage >= 0 &&
        blockLower >= 0 &&
        blockUpper > blockLower &&
        pricePerUnit >= 0,
      "usageBefore",
    );
    return (() => {
      const addedUsageInBlock = Math.max(
        0,
        Math.min(usageBefore + addedUsage, blockUpper) -
          Math.max(usageBefore, blockLower),
      );
      return {
        addedUsageInBlock,
        blockCharge: addedUsageInBlock * pricePerUnit,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    usageBefore: 90,
    addedUsage: 30,
    blockLower: 100,
    blockUpper: 200,
    pricePerUnit: 0.2,
  },
  output: { addedUsageInBlock: 20, blockCharge: 4 },
} satisfies ToolExample<Input, Output>;
export const tariffBlockMarginalChargeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["energy-economics", "energy economics", "economics"],
      keywords: ["energy economics", "economics"],
    },
    id: "energy-economics/tariff-block-marginal-charge",
    title: "Tariff Block Marginal Charge",
    description:
      "Price only the overlap of added usage with one explicit tariff block without constructing a complete bill.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        usageBefore: { type: "number", minimum: 0 },
        addedUsage: { type: "number", minimum: 0 },
        blockLower: { type: "number", minimum: 0 },
        blockUpper: { type: "number" },
        pricePerUnit: { type: "number", minimum: 0 },
      },
      required: [
        "usageBefore",
        "addedUsage",
        "blockLower",
        "blockUpper",
        "pricePerUnit",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        addedUsageInBlock: { type: "number" },
        blockCharge: { type: "number" },
      },
      required: ["addedUsageInBlock", "blockCharge"],
    },
    ports: {
      inputs: [
        {
          id: "usageBefore",
          label: "Usage Before",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "addedUsage",
          label: "Added Usage",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "blockLower",
          label: "Block Lower",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "blockUpper",
          label: "Block Upper",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "pricePerUnit",
          label: "Price Per Unit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "addedUsageInBlock",
          label: "Added Usage In Block",
          valueType: { type: "number" },
        },
        {
          id: "blockCharge",
          label: "Block Charge",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = tariffBlockMarginalChargeTool.execute;
export default tariffBlockMarginalChargeTool;
