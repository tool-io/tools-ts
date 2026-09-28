import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly amount: number;
  readonly threshold: number;
  readonly taper: number;
  readonly cap: number;
  readonly equalityInTaper: boolean;
};
export type Output = {
  readonly copayment: number;
  readonly marginalRate: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    amount: { type: "number", minimum: 0 },
    threshold: { type: "number", minimum: 0 },
    taper: { type: "number", minimum: 0 },
    cap: { type: "number", minimum: 0 },
    equalityInTaper: { type: "boolean" },
  },
  required: ["amount", "threshold", "taper", "cap", "equalityInTaper"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    copayment: { type: "number" },
    marginalRate: { type: "number" },
  },
  required: ["copayment", "marginalRate"],
} as const;
/** Evaluate a supplied capped taper and explicit threshold derivative convention; the derivative at the cap is assigned zero. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { amount, threshold, taper, cap, equalityInTaper } = request;
  const compute = (): Output => {
    H.domain(amount >= 0 && threshold >= 0 && taper >= 0 && cap >= 0);
    return {
      copayment: Math.min(cap, Math.max(0, amount - threshold) * taper),
      marginalRate:
        (equalityInTaper ? amount >= threshold : amount > threshold) &&
        Math.max(0, amount - threshold) * taper < cap
          ? taper
          : 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    amount: 30,
    threshold: 10,
    taper: 0.5,
    cap: 20,
    equalityInTaper: false,
  },
  output: { copayment: 10, marginalRate: 0.5 },
} satisfies ToolExample<Input, Output>;
export const copaymentTaperMarginalTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-policy/copayment-taper-marginal-term",
    title: "Copayment Taper Marginal Term Tool",
    description:
      "Evaluate a supplied capped taper and explicit threshold derivative convention; the derivative at the cap is assigned zero.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        amount: { type: "number", minimum: 0 },
        threshold: { type: "number", minimum: 0 },
        taper: { type: "number", minimum: 0 },
        cap: { type: "number", minimum: 0 },
        equalityInTaper: { type: "boolean" },
      },
      required: ["amount", "threshold", "taper", "cap", "equalityInTaper"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        copayment: { type: "number" },
        marginalRate: { type: "number" },
      },
      required: ["copayment", "marginalRate"],
    },
    ports: {
      inputs: [
        {
          id: "amount",
          label: "Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "threshold",
          label: "Threshold",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "taper",
          label: "Taper",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cap",
          label: "Cap",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "equalityInTaper",
          label: "Equality In Taper",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "copayment", label: "Copayment", valueType: { type: "number" } },
        {
          id: "marginalRate",
          label: "Marginal Rate",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = copaymentTaperMarginalTermTool.execute;
export default copaymentTaperMarginalTermTool;
