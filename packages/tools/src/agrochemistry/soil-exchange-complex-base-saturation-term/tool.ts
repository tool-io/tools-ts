import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baseCations: readonly number[];
  readonly exchangeCapacity: number;
};
export type Output = {
  readonly baseTotal: number;
  readonly saturationPercent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseCations: { type: "array", maxItems: 256, items: { type: "number" } },
    exchangeCapacity: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["baseCations", "exchangeCapacity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseTotal: { type: "number" },
    saturationPercent: { type: "number" },
  },
  required: ["baseTotal", "saturationPercent"],
} as const;
/** Supplied same-equivalent-unit base-cation inventory relative to explicit capacity. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baseCations, exchangeCapacity } = request;
  const compute = (): Output => {
    H.positive(exchangeCapacity);
    H.domain(baseCations.every((x) => x >= 0));
    return {
      baseTotal: baseCations.reduce((a, b) => a + b, 0),
      saturationPercent:
        (100 * baseCations.reduce((a, b) => a + b, 0)) / exchangeCapacity,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { baseCations: [2, 3, 1], exchangeCapacity: 10 },
  output: { baseTotal: 6, saturationPercent: 60 },
} satisfies ToolExample<Input, Output>;
export const soilExchangeComplexBaseSaturationTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agrochemistry/soil-exchange-complex-base-saturation-term",
      title: "Soil Exchange Complex Base Saturation Term Tool",
      description:
        "Supplied same-equivalent-unit base-cation inventory relative to explicit capacity.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          baseCations: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          exchangeCapacity: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["baseCations", "exchangeCapacity"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          baseTotal: { type: "number" },
          saturationPercent: { type: "number" },
        },
        required: ["baseTotal", "saturationPercent"],
      },
      ports: {
        inputs: [
          {
            id: "baseCations",
            label: "Base Cations",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "exchangeCapacity",
            label: "Exchange Capacity",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "baseTotal",
            label: "Base Total",
            valueType: { type: "number" },
          },
          {
            id: "saturationPercent",
            label: "Saturation Percent",
            valueType: { type: "number", unit: "%" },
          },
        ],
      },
    },
    calculate,
  });
export const run = soilExchangeComplexBaseSaturationTermTool.execute;
export default soilExchangeComplexBaseSaturationTermTool;
