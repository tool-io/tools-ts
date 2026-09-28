import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly allowed: number;
  readonly remainingDeductible: number;
  readonly coinsurance: number;
  readonly remainingOutOfPocket: number;
};
export type Output = {
  readonly deductiblePaid: number;
  readonly coinsurancePaid: number;
  readonly patientPaid: number;
  readonly insurerPaid: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    allowed: { type: "number", minimum: 0 },
    remainingDeductible: { type: "number", minimum: 0 },
    coinsurance: { type: "number", minimum: 0, maximum: 1 },
    remainingOutOfPocket: { type: "number", minimum: 0 },
  },
  required: [
    "allowed",
    "remainingDeductible",
    "coinsurance",
    "remainingOutOfPocket",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deductiblePaid: { type: "number" },
    coinsurancePaid: { type: "number" },
    patientPaid: { type: "number" },
    insurerPaid: { type: "number" },
  },
  required: ["deductiblePaid", "coinsurancePaid", "patientPaid", "insurerPaid"],
} as const;
/** Apply deductible then coinsurance, jointly limited by an explicit remaining patient cap. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { allowed, remainingDeductible, coinsurance, remainingOutOfPocket } =
    request;
  const compute = (): Output => {
    H.domain(
      allowed >= 0 && remainingDeductible >= 0 && remainingOutOfPocket >= 0,
    );
    H.probability(coinsurance);
    return {
      deductiblePaid: Math.min(
        allowed,
        remainingDeductible,
        remainingOutOfPocket,
      ),
      coinsurancePaid: Math.min(
        Math.max(0, allowed - remainingDeductible) * coinsurance,
        Math.max(
          0,
          remainingOutOfPocket - Math.min(allowed, remainingDeductible),
        ),
      ),
      patientPaid: Math.min(
        remainingOutOfPocket,
        Math.min(allowed, remainingDeductible) +
          Math.max(0, allowed - remainingDeductible) * coinsurance,
      ),
      insurerPaid:
        allowed -
        Math.min(
          remainingOutOfPocket,
          Math.min(allowed, remainingDeductible) +
            Math.max(0, allowed - remainingDeductible) * coinsurance,
        ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    allowed: 1000,
    remainingDeductible: 200,
    coinsurance: 0.2,
    remainingOutOfPocket: 500,
  },
  output: {
    deductiblePaid: 200,
    coinsurancePaid: 160,
    patientPaid: 360,
    insurerPaid: 640,
  },
} satisfies ToolExample<Input, Output>;
export const deductibleCoinsuranceOrderOneBillTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-policy/deductible-coinsurance-order-one-bill",
    title: "Deductible Coinsurance Order One Bill Tool",
    description:
      "Apply deductible then coinsurance, jointly limited by an explicit remaining patient cap.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        allowed: { type: "number", minimum: 0 },
        remainingDeductible: { type: "number", minimum: 0 },
        coinsurance: { type: "number", minimum: 0, maximum: 1 },
        remainingOutOfPocket: { type: "number", minimum: 0 },
      },
      required: [
        "allowed",
        "remainingDeductible",
        "coinsurance",
        "remainingOutOfPocket",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deductiblePaid: { type: "number" },
        coinsurancePaid: { type: "number" },
        patientPaid: { type: "number" },
        insurerPaid: { type: "number" },
      },
      required: [
        "deductiblePaid",
        "coinsurancePaid",
        "patientPaid",
        "insurerPaid",
      ],
    },
    ports: {
      inputs: [
        {
          id: "allowed",
          label: "Allowed",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "remainingDeductible",
          label: "Remaining Deductible",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "coinsurance",
          label: "Coinsurance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "remainingOutOfPocket",
          label: "Remaining Out Of Pocket",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "deductiblePaid",
          label: "Deductible Paid",
          valueType: { type: "number" },
        },
        {
          id: "coinsurancePaid",
          label: "Coinsurance Paid",
          valueType: { type: "number" },
        },
        {
          id: "patientPaid",
          label: "Patient Paid",
          valueType: { type: "number" },
        },
        {
          id: "insurerPaid",
          label: "Insurer Paid",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = deductibleCoinsuranceOrderOneBillTool.execute;
export default deductibleCoinsuranceOrderOneBillTool;
