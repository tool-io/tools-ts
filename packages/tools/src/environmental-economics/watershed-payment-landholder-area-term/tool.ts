import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly enrolledArea: number;
  readonly verifiedFraction: number;
  readonly paymentPerArea: number;
  readonly fixedParticipationCost: number;
};
export type Output = {
  readonly eligibleArea: number;
  readonly payment: number;
  readonly netBenefit: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    enrolledArea: { type: "number", minimum: 0 },
    verifiedFraction: { type: "number", minimum: 0, maximum: 1 },
    paymentPerArea: { type: "number" },
    fixedParticipationCost: { type: "number", minimum: 0 },
  },
  required: [
    "enrolledArea",
    "verifiedFraction",
    "paymentPerArea",
    "fixedParticipationCost",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleArea: { type: "number" },
    payment: { type: "number" },
    netBenefit: { type: "number" },
  },
  required: ["eligibleArea", "payment", "netBenefit"],
} as const;
/** Calculate watershed payment landholder area term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    enrolledArea,
    verifiedFraction,
    paymentPerArea,
    fixedParticipationCost,
  } = request;
  const compute = (): Output => {
    H.domain(enrolledArea >= 0 && fixedParticipationCost >= 0);
    H.probability(verifiedFraction);
    return {
      eligibleArea: enrolledArea * verifiedFraction,
      payment: enrolledArea * verifiedFraction * paymentPerArea,
      netBenefit:
        enrolledArea * verifiedFraction * paymentPerArea -
        fixedParticipationCost,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    enrolledArea: 50,
    verifiedFraction: 0.8,
    paymentPerArea: 100,
    fixedParticipationCost: 500,
  },
  output: { eligibleArea: 40, payment: 4000, netBenefit: 3500 },
} satisfies ToolExample<Input, Output>;
export const watershedPaymentLandholderAreaTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "environmental-economics/watershed-payment-landholder-area-term",
    title: "Watershed Payment Landholder Area Term Tool",
    description:
      "Calculate watershed payment landholder area term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        enrolledArea: { type: "number", minimum: 0 },
        verifiedFraction: { type: "number", minimum: 0, maximum: 1 },
        paymentPerArea: { type: "number" },
        fixedParticipationCost: { type: "number", minimum: 0 },
      },
      required: [
        "enrolledArea",
        "verifiedFraction",
        "paymentPerArea",
        "fixedParticipationCost",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleArea: { type: "number" },
        payment: { type: "number" },
        netBenefit: { type: "number" },
      },
      required: ["eligibleArea", "payment", "netBenefit"],
    },
    ports: {
      inputs: [
        {
          id: "enrolledArea",
          label: "Enrolled Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "verifiedFraction",
          label: "Verified Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "paymentPerArea",
          label: "Payment Per Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fixedParticipationCost",
          label: "Fixed Participation Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "eligibleArea",
          label: "Eligible Area",
          valueType: { type: "number" },
        },
        { id: "payment", label: "Payment", valueType: { type: "number" } },
        {
          id: "netBenefit",
          label: "Net Benefit",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = watershedPaymentLandholderAreaTermTool.execute;
export default watershedPaymentLandholderAreaTermTool;
