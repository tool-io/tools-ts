import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly calculatedCopay: number;
  readonly suppliedCap: number;
  readonly capApplies: boolean;
};
export type Output = {
  readonly appliedCopay: number;
  readonly reduction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    calculatedCopay: { type: "number", minimum: 0 },
    suppliedCap: { type: "number", minimum: 0 },
    capApplies: { type: "boolean" },
  },
  required: ["calculatedCopay", "suppliedCap", "capApplies"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    appliedCopay: { type: "number" },
    reduction: { type: "number" },
  },
  required: ["appliedCopay", "reduction"],
} as const;
/** Apply an explicit copay cap switch to a supplied amount without interpreting insurance eligibility or plan terms. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { calculatedCopay, suppliedCap, capApplies } = request;
  const compute = (): Output => {
    H.domain(calculatedCopay >= 0 && suppliedCap >= 0, "calculatedCopay");
    return (() => {
      const appliedCopay = capApplies
        ? Math.min(calculatedCopay, suppliedCap)
        : calculatedCopay;
      return { appliedCopay, reduction: calculatedCopay - appliedCopay };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { calculatedCopay: 50, suppliedCap: 30, capApplies: true },
  output: { appliedCopay: 30, reduction: 20 },
} satisfies ToolExample<Input, Output>;
export const benefitCopayCapApplierTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["health-policy", "health policy", "social sciences"],
      keywords: ["health policy", "social sciences"],
    },
    id: "health-policy/benefit-copay-cap-applier",
    title: "Benefit Copay Cap Applier",
    description:
      "Apply an explicit copay cap switch to a supplied amount without interpreting insurance eligibility or plan terms.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        calculatedCopay: { type: "number", minimum: 0 },
        suppliedCap: { type: "number", minimum: 0 },
        capApplies: { type: "boolean" },
      },
      required: ["calculatedCopay", "suppliedCap", "capApplies"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        appliedCopay: { type: "number" },
        reduction: { type: "number" },
      },
      required: ["appliedCopay", "reduction"],
    },
    ports: {
      inputs: [
        {
          id: "calculatedCopay",
          label: "Calculated Copay",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedCap",
          label: "Supplied Cap",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "capApplies",
          label: "Cap Applies",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "appliedCopay",
          label: "Applied Copay",
          valueType: { type: "number" },
        },
        { id: "reduction", label: "Reduction", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = benefitCopayCapApplierTool.execute;
export default benefitCopayCapApplierTool;
