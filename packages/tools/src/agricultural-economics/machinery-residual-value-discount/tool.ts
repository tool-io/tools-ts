import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly futureResidualValue: number;
  readonly perPeriodRate: number;
  readonly periods: number;
};
export type Output = { readonly presentResidualValue: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    futureResidualValue: { type: "number", minimum: 0 },
    perPeriodRate: { type: "number", exclusiveMinimum: -1 },
    periods: { type: "number", minimum: 0 },
  },
  required: ["futureResidualValue", "perPeriodRate", "periods"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { presentResidualValue: { type: "number" } },
  required: ["presentResidualValue"],
} as const;
/** Discount a supplied future machinery residual value with an explicit per-period compound rate and period count. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { futureResidualValue, perPeriodRate, periods } = request;
  const compute = (): Output => {
    H.domain(futureResidualValue >= 0, "futureResidualValue");
    H.domain(perPeriodRate > -1, "perPeriodRate");
    H.domain(periods >= 0, "periods");
    return {
      presentResidualValue:
        futureResidualValue / Math.pow(1 + perPeriodRate, periods),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { futureResidualValue: 1210, perPeriodRate: 0.1, periods: 2 },
  output: { presentResidualValue: 999.9999999999999 },
} satisfies ToolExample<Input, Output>;
export const machineryResidualValueDiscountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "agricultural-economics",
        "agricultural economics",
        "agriculture",
      ],
      keywords: ["agricultural economics", "agriculture"],
    },
    id: "agricultural-economics/machinery-residual-value-discount",
    title: "Machinery Residual Value Discount",
    description:
      "Discount a supplied future machinery residual value with an explicit per-period compound rate and period count.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        futureResidualValue: { type: "number", minimum: 0 },
        perPeriodRate: { type: "number", exclusiveMinimum: -1 },
        periods: { type: "number", minimum: 0 },
      },
      required: ["futureResidualValue", "perPeriodRate", "periods"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { presentResidualValue: { type: "number" } },
      required: ["presentResidualValue"],
    },
    ports: {
      inputs: [
        {
          id: "futureResidualValue",
          label: "Future Residual Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "perPeriodRate",
          label: "Per Period Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "periods",
          label: "Periods",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "presentResidualValue",
          label: "Present Residual Value",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = machineryResidualValueDiscountTool.execute;
export default machineryResidualValueDiscountTool;
