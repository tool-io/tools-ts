import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly principal: number;
  readonly interest: number;
  readonly waiver: number;
  readonly interestFirst: boolean;
};
export type Output = {
  readonly principalWaived: number;
  readonly interestWaived: number;
  readonly excess: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    principal: { type: "number", minimum: 0 },
    interest: { type: "number", minimum: 0 },
    waiver: { type: "number", minimum: 0 },
    interestFirst: { type: "boolean" },
  },
  required: ["principal", "interest", "waiver", "interestFirst"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    principalWaived: { type: "number" },
    interestWaived: { type: "number" },
    excess: { type: "number" },
  },
  required: ["principalWaived", "interestWaived", "excess"],
} as const;
/** Allocate an explicit debt waiver by a supplied principal-first or interest-first policy. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { principal, interest, waiver, interestFirst } = input;
  const compute = (): Output => {
    H.domain(principal >= 0 && interest >= 0 && waiver >= 0);
    const interestWaived = interestFirst
        ? Math.min(interest, waiver)
        : Math.min(interest, Math.max(0, waiver - principal)),
      principalWaived = Math.min(principal, waiver - interestWaived);
    return {
      principalWaived,
      interestWaived,
      excess: Math.max(0, waiver - principal - interest),
    };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { principal: 100, interest: 20, waiver: 30, interestFirst: true },
  output: { principalWaived: 10, interestWaived: 20, excess: 0 },
} satisfies ToolExample<Input, Output>;
export const debtWaiverPrincipalInterestAllocationTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "finance/debt-waiver-principal-interest-allocation",
      title: "Debt Waiver Principal Interest Allocation Tool",
      description:
        "Allocate an explicit debt waiver by a supplied principal-first or interest-first policy.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          principal: { type: "number", minimum: 0 },
          interest: { type: "number", minimum: 0 },
          waiver: { type: "number", minimum: 0 },
          interestFirst: { type: "boolean" },
        },
        required: ["principal", "interest", "waiver", "interestFirst"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          principalWaived: { type: "number" },
          interestWaived: { type: "number" },
          excess: { type: "number" },
        },
        required: ["principalWaived", "interestWaived", "excess"],
      },
      ports: {
        inputs: [
          {
            id: "principal",
            label: "Principal",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "interest",
            label: "Interest",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "waiver",
            label: "Waiver",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "interestFirst",
            label: "Interest First",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "principalWaived",
            label: "Principal Waived",
            valueType: { type: "number" },
          },
          {
            id: "interestWaived",
            label: "Interest Waived",
            valueType: { type: "number" },
          },
          { id: "excess", label: "Excess", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = debtWaiverPrincipalInterestAllocationTool.execute;
export default debtWaiverPrincipalInterestAllocationTool;
