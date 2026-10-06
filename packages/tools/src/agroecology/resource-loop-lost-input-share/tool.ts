import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly lostInputAmount: number;
  readonly totalInputAmount: number;
};
export type Output = { readonly fraction: number; readonly remainder: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lostInputAmount: { type: "number", minimum: 0 },
    totalInputAmount: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["lostInputAmount", "totalInputAmount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, remainder: { type: "number" } },
  required: ["fraction", "remainder"],
} as const;
/** Calculate an explicitly measured resource-loop loss fraction and retained amount in consistent units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { lostInputAmount, totalInputAmount } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(totalInputAmount) && totalInputAmount > 0,
      "totalInputAmount",
    ),
      totalInputAmount);
    H.domain(
      lostInputAmount >= 0 && lostInputAmount <= totalInputAmount,
      "lostInputAmount",
    );
    return {
      fraction: lostInputAmount / totalInputAmount,
      remainder: totalInputAmount - lostInputAmount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { lostInputAmount: 30, totalInputAmount: 120 },
  output: { fraction: 0.25, remainder: 90 },
} satisfies ToolExample<Input, Output>;
export const resourceLoopLostInputShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agroecology", "agriculture"],
      keywords: ["agroecology", "agriculture"],
    },
    id: "agroecology/resource-loop-lost-input-share",
    title: "Resource Loop Lost Input Share",
    description:
      "Calculate an explicitly measured resource-loop loss fraction and retained amount in consistent units.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lostInputAmount: { type: "number", minimum: 0 },
        totalInputAmount: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["lostInputAmount", "totalInputAmount"],
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
          id: "lostInputAmount",
          label: "Lost Input Amount",
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
export const run = resourceLoopLostInputShareTool.execute;
export default resourceLoopLostInputShareTool;
