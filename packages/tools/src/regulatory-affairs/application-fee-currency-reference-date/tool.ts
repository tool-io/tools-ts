import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fee: number;
  readonly exchangeFactor: number;
  readonly feeDay: number;
  readonly rateDay: number;
  readonly allowedAgeDays: number;
};
export type Output = {
  readonly convertedFee: number;
  readonly ageDays: number;
  readonly rateWithinWindow: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fee: { type: "number", minimum: 0 },
    exchangeFactor: { type: "number", exclusiveMinimum: 0 },
    feeDay: { type: "integer" },
    rateDay: { type: "integer" },
    allowedAgeDays: { type: "integer", minimum: 0 },
  },
  required: ["fee", "exchangeFactor", "feeDay", "rateDay", "allowedAgeDays"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    convertedFee: { type: "number" },
    ageDays: { type: "integer" },
    rateWithinWindow: { type: "boolean" },
  },
  required: ["convertedFee", "ageDays", "rateWithinWindow"],
} as const;
/** Calculate application fee currency reference date from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fee, exchangeFactor, feeDay, rateDay, allowedAgeDays } = request;
  const compute = (): Output => {
    H.domain(fee >= 0);
    H.positive(exchangeFactor);
    H.integer(allowedAgeDays, 0);
    return {
      convertedFee: fee * exchangeFactor,
      ageDays: feeDay - rateDay,
      rateWithinWindow: rateDay <= feeDay && feeDay - rateDay <= allowedAgeDays,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    fee: 100,
    exchangeFactor: 1.2,
    feeDay: 110,
    rateDay: 108,
    allowedAgeDays: 3,
  },
  output: { convertedFee: 120, ageDays: 2, rateWithinWindow: true },
} satisfies ToolExample<Input, Output>;
export const applicationFeeCurrencyReferenceDateTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "regulatory-affairs/application-fee-currency-reference-date",
      title: "Application Fee Currency Reference Date Tool",
      description:
        "Calculate application fee currency reference date from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          fee: { type: "number", minimum: 0 },
          exchangeFactor: { type: "number", exclusiveMinimum: 0 },
          feeDay: { type: "integer" },
          rateDay: { type: "integer" },
          allowedAgeDays: { type: "integer", minimum: 0 },
        },
        required: [
          "fee",
          "exchangeFactor",
          "feeDay",
          "rateDay",
          "allowedAgeDays",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          convertedFee: { type: "number" },
          ageDays: { type: "integer" },
          rateWithinWindow: { type: "boolean" },
        },
        required: ["convertedFee", "ageDays", "rateWithinWindow"],
      },
      ports: {
        inputs: [
          {
            id: "fee",
            label: "Fee",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "exchangeFactor",
            label: "Exchange Factor",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "feeDay",
            label: "Fee Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "rateDay",
            label: "Rate Day",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "allowedAgeDays",
            label: "Allowed Age Days",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "convertedFee",
            label: "Converted Fee",
            valueType: { type: "number" },
          },
          { id: "ageDays", label: "Age Days", valueType: { type: "integer" } },
          {
            id: "rateWithinWindow",
            label: "Rate Within Window",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = applicationFeeCurrencyReferenceDateTool.execute;
export default applicationFeeCurrencyReferenceDateTool;
