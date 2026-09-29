import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly specificCharge: number;
  readonly quantity: number;
  readonly declaredValue: number;
  readonly chargeCurrency: string;
  readonly valueCurrency: string;
  readonly quantityUnit: string;
  readonly chargePerUnit: string;
};
export type Output = { readonly rateContribution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    specificCharge: { type: "number", minimum: 0 },
    quantity: { type: "number", minimum: 0 },
    declaredValue: { type: "number", exclusiveMinimum: 0 },
    chargeCurrency: { type: "string", maxLength: 8192 },
    valueCurrency: { type: "string", maxLength: 8192 },
    quantityUnit: { type: "string", maxLength: 8192 },
    chargePerUnit: { type: "string", maxLength: 8192 },
  },
  required: [
    "specificCharge",
    "quantity",
    "declaredValue",
    "chargeCurrency",
    "valueCurrency",
    "quantityUnit",
    "chargePerUnit",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { rateContribution: { type: "number" } },
  required: ["rateContribution"],
} as const;
/** Return one supplied specific-charge contribution to an ad valorem rate with explicit currency and quantity basis agreement. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    specificCharge,
    quantity,
    declaredValue,
    chargeCurrency,
    valueCurrency,
    quantityUnit,
    chargePerUnit,
  } = request;
  const compute = (): Output => {
    H.domain(
      specificCharge >= 0 &&
        quantity >= 0 &&
        chargeCurrency.length > 0 &&
        chargeCurrency === valueCurrency &&
        quantityUnit.length > 0 &&
        quantityUnit === chargePerUnit,
    );
    H.positive(declaredValue);
    return { rateContribution: (specificCharge * quantity) / declaredValue };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    specificCharge: 2,
    quantity: 10,
    declaredValue: 100,
    chargeCurrency: "USD",
    valueCurrency: "USD",
    quantityUnit: "kg",
    chargePerUnit: "kg",
  },
  output: { rateContribution: 0.2 },
} satisfies ToolExample<Input, Output>;
export const tariffAdvaloremEquivalentTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-economics/tariff-advalorem-equivalent-term",
    title: "Tariff Advalorem Equivalent Term Tool",
    description:
      "Return one supplied specific-charge contribution to an ad valorem rate with explicit currency and quantity basis agreement.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        specificCharge: { type: "number", minimum: 0 },
        quantity: { type: "number", minimum: 0 },
        declaredValue: { type: "number", exclusiveMinimum: 0 },
        chargeCurrency: { type: "string", maxLength: 8192 },
        valueCurrency: { type: "string", maxLength: 8192 },
        quantityUnit: { type: "string", maxLength: 8192 },
        chargePerUnit: { type: "string", maxLength: 8192 },
      },
      required: [
        "specificCharge",
        "quantity",
        "declaredValue",
        "chargeCurrency",
        "valueCurrency",
        "quantityUnit",
        "chargePerUnit",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { rateContribution: { type: "number" } },
      required: ["rateContribution"],
    },
    ports: {
      inputs: [
        {
          id: "specificCharge",
          label: "Specific Charge",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "quantity",
          label: "Quantity",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "declaredValue",
          label: "Declared Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "chargeCurrency",
          label: "Charge Currency",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "valueCurrency",
          label: "Value Currency",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "quantityUnit",
          label: "Quantity Unit",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "chargePerUnit",
          label: "Charge Per Unit",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "rateContribution",
          label: "Rate Contribution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = tariffAdvaloremEquivalentTermTool.execute;
export default tariffAdvaloremEquivalentTermTool;
