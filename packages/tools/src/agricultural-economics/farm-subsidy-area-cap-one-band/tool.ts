import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly eligibleArea: number;
  readonly exemptArea: number;
  readonly areaCap: number;
  readonly paymentPerArea: number;
};
export type Output = { readonly paidArea: number; readonly payment: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleArea: { type: "number", minimum: 0 },
    exemptArea: { type: "number", minimum: 0 },
    areaCap: { type: "number", minimum: 0 },
    paymentPerArea: { type: "number", minimum: 0 },
  },
  required: ["eligibleArea", "exemptArea", "areaCap", "paymentPerArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { paidArea: { type: "number" }, payment: { type: "number" } },
  required: ["paidArea", "payment"],
} as const;
/** Caller-supplied exempt area, capped paid area and payment rate; no subsidy eligibility or legal rule is selected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { eligibleArea, exemptArea, areaCap, paymentPerArea } = request;
  const compute = (): Output => {
    H.domain(
      eligibleArea >= 0 &&
        exemptArea >= 0 &&
        areaCap >= 0 &&
        paymentPerArea >= 0,
    );
    return {
      paidArea: Math.min(areaCap, Math.max(0, eligibleArea - exemptArea)),
      payment:
        Math.min(areaCap, Math.max(0, eligibleArea - exemptArea)) *
        paymentPerArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    eligibleArea: 120,
    exemptArea: 20,
    areaCap: 80,
    paymentPerArea: 100,
  },
  output: { paidArea: 80, payment: 8000 },
} satisfies ToolExample<Input, Output>;
export const farmSubsidyAreaCapOneBandTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-economics/farm-subsidy-area-cap-one-band",
    title: "Farm Subsidy Area Cap One Band Tool",
    description:
      "Caller-supplied exempt area, capped paid area and payment rate; no subsidy eligibility or legal rule is selected.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleArea: { type: "number", minimum: 0 },
        exemptArea: { type: "number", minimum: 0 },
        areaCap: { type: "number", minimum: 0 },
        paymentPerArea: { type: "number", minimum: 0 },
      },
      required: ["eligibleArea", "exemptArea", "areaCap", "paymentPerArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { paidArea: { type: "number" }, payment: { type: "number" } },
      required: ["paidArea", "payment"],
    },
    ports: {
      inputs: [
        {
          id: "eligibleArea",
          label: "Eligible Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "exemptArea",
          label: "Exempt Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "areaCap",
          label: "Area Cap",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "paymentPerArea",
          label: "Payment Per Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "paidArea", label: "Paid Area", valueType: { type: "number" } },
        { id: "payment", label: "Payment", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = farmSubsidyAreaCapOneBandTool.execute;
export default farmSubsidyAreaCapOneBandTool;
