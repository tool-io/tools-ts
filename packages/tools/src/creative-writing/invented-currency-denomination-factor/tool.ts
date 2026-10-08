import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceAmount: number;
  readonly targetUnitsPerSourceUnit: number;
};
export type Output = { readonly targetAmount: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceAmount: { type: "number" },
    targetUnitsPerSourceUnit: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["sourceAmount", "targetUnitsPerSourceUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { targetAmount: { type: "number" } },
  required: ["targetAmount"],
} as const;
/** Convert a signed fictional currency amount using an explicit positive denomination factor without looking up exchange rates. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceAmount, targetUnitsPerSourceUnit } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isFinite(targetUnitsPerSourceUnit) && targetUnitsPerSourceUnit > 0,
      "targetUnitsPerSourceUnit",
    ),
      targetUnitsPerSourceUnit);
    return { targetAmount: sourceAmount * targetUnitsPerSourceUnit };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceAmount: 7, targetUnitsPerSourceUnit: 12 },
  output: { targetAmount: 84 },
} satisfies ToolExample<Input, Output>;
export const inventedCurrencyDenominationFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["creative-writing", "creative writing", "humanities"],
      keywords: ["creative writing", "humanities"],
    },
    id: "creative-writing/invented-currency-denomination-factor",
    title: "Invented Currency Denomination Factor",
    description:
      "Convert a signed fictional currency amount using an explicit positive denomination factor without looking up exchange rates.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceAmount: { type: "number" },
        targetUnitsPerSourceUnit: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["sourceAmount", "targetUnitsPerSourceUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { targetAmount: { type: "number" } },
      required: ["targetAmount"],
    },
    ports: {
      inputs: [
        {
          id: "sourceAmount",
          label: "Source Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetUnitsPerSourceUnit",
          label: "Target Units Per Source Unit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "targetAmount",
          label: "Target Amount",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = inventedCurrencyDenominationFactorTool.execute;
export default inventedCurrencyDenominationFactorTool;
