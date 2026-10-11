import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly externalInputAmount: number;
  readonly totalInputAmount: number;
};
export type Output = { readonly fraction: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    externalInputAmount: { type: "number", minimum: 0 },
    totalInputAmount: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["externalInputAmount", "totalInputAmount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, remainder: { type: "number" } },
  required: ["fraction", "remainder"],
} as const;
/** Normalize an explicitly recorded external-input amount to compatible total input on a caller-defined accounting basis. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { externalInputAmount, totalInputAmount } = request;
  const compute = (): Output => {
    (H.domain(totalInputAmount > 0, "totalInputAmount"), totalInputAmount);
    H.domain(
      externalInputAmount >= 0 && externalInputAmount <= totalInputAmount,
      "externalInputAmount",
    );
    return {
      fraction: externalInputAmount / totalInputAmount,
      remainder: totalInputAmount - externalInputAmount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { externalInputAmount: 30, totalInputAmount: 120 },
  output: { fraction: 0.25, remainder: 90 },
} satisfies ToolExample<Input, Output>;
export const farmResourceExternalInputShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "sustainable-agriculture",
        "sustainable agriculture",
        "agriculture",
      ],
      keywords: ["sustainable agriculture", "agriculture"],
    },
    id: "sustainable-agriculture/farm-resource-external-input-share",
    title: "Farm Resource External Input Share",
    description:
      "Normalize an explicitly recorded external-input amount to compatible total input on a caller-defined accounting basis.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        externalInputAmount: { type: "number", minimum: 0 },
        totalInputAmount: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["externalInputAmount", "totalInputAmount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        remainder: { type: "number" },
      },
      required: ["fraction", "remainder"],
    },
    ports: {
      inputs: [
        {
          id: "externalInputAmount",
          label: "External Input Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalInputAmount",
          label: "Total Input Amount",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        { id: "remainder", label: "Remainder", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = farmResourceExternalInputShareTool.execute;
export default farmResourceExternalInputShareTool;
