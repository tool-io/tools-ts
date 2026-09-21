import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly deposit: number;
  readonly hireCharge: number;
  readonly damageCharge: number;
  readonly otherCredit: number;
};
export type Output = { readonly refund: number; readonly balanceDue: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deposit: { type: "number", minimum: 0 },
    hireCharge: { type: "number", minimum: 0 },
    damageCharge: { type: "number", minimum: 0 },
    otherCredit: { type: "number", minimum: 0 },
  },
  required: ["deposit", "hireCharge", "damageCharge", "otherCredit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { refund: { type: "number" }, balanceDue: { type: "number" } },
  required: ["refund", "balanceDue"],
} as const;
/** Calculate farm machinery deposit release term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { deposit, hireCharge, damageCharge, otherCredit } = request;
  const compute = (): Output => {
    H.domain(
      deposit >= 0 && hireCharge >= 0 && damageCharge >= 0 && otherCredit >= 0,
    );
    return {
      refund: Math.max(0, deposit + otherCredit - hireCharge - damageCharge),
      balanceDue: Math.max(
        0,
        hireCharge + damageCharge - deposit - otherCredit,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { deposit: 500, hireCharge: 200, damageCharge: 50, otherCredit: 0 },
  output: { refund: 250, balanceDue: 0 },
} satisfies ToolExample<Input, Output>;
export const farmMachineryDepositReleaseTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agribusiness/farm-machinery-deposit-release-term",
    title: "Farm Machinery Deposit Release Term Tool",
    description:
      "Calculate farm machinery deposit release term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        deposit: { type: "number", minimum: 0 },
        hireCharge: { type: "number", minimum: 0 },
        damageCharge: { type: "number", minimum: 0 },
        otherCredit: { type: "number", minimum: 0 },
      },
      required: ["deposit", "hireCharge", "damageCharge", "otherCredit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        refund: { type: "number" },
        balanceDue: { type: "number" },
      },
      required: ["refund", "balanceDue"],
    },
    ports: {
      inputs: [
        {
          id: "deposit",
          label: "Deposit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "hireCharge",
          label: "Hire Charge",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "damageCharge",
          label: "Damage Charge",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "otherCredit",
          label: "Other Credit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "refund", label: "Refund", valueType: { type: "number" } },
        {
          id: "balanceDue",
          label: "Balance Due",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = farmMachineryDepositReleaseTermTool.execute;
export default farmMachineryDepositReleaseTermTool;
