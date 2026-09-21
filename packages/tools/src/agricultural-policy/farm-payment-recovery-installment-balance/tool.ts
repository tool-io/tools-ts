import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly principal: number;
  readonly recovered: number;
  readonly installment: number;
};
export type Output = {
  readonly remaining: number;
  readonly nextRecovery: number;
  readonly afterNext: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    principal: { type: "number", minimum: 0 },
    recovered: { type: "number", minimum: 0 },
    installment: { type: "number", minimum: 0 },
  },
  required: ["principal", "recovered", "installment"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    remaining: { type: "number" },
    nextRecovery: { type: "number" },
    afterNext: { type: "number" },
  },
  required: ["remaining", "nextRecovery", "afterNext"],
} as const;
/** Calculate farm payment recovery installment balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { principal, recovered, installment } = request;
  const compute = (): Output => {
    H.domain(
      principal >= 0 &&
        recovered >= 0 &&
        recovered <= principal &&
        installment >= 0,
    );
    return {
      remaining: principal - recovered,
      nextRecovery: Math.min(installment, principal - recovered),
      afterNext: Math.max(0, principal - recovered - installment),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { principal: 1000, recovered: 700, installment: 200 },
  output: { remaining: 300, nextRecovery: 200, afterNext: 100 },
} satisfies ToolExample<Input, Output>;
export const farmPaymentRecoveryInstallmentBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "agricultural-policy/farm-payment-recovery-installment-balance",
      title: "Farm Payment Recovery Installment Balance Tool",
      description:
        "Calculate farm payment recovery installment balance from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          principal: { type: "number", minimum: 0 },
          recovered: { type: "number", minimum: 0 },
          installment: { type: "number", minimum: 0 },
        },
        required: ["principal", "recovered", "installment"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          remaining: { type: "number" },
          nextRecovery: { type: "number" },
          afterNext: { type: "number" },
        },
        required: ["remaining", "nextRecovery", "afterNext"],
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
            id: "recovered",
            label: "Recovered",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "installment",
            label: "Installment",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "remaining",
            label: "Remaining",
            valueType: { type: "number" },
          },
          {
            id: "nextRecovery",
            label: "Next Recovery",
            valueType: { type: "number" },
          },
          {
            id: "afterNext",
            label: "After Next",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = farmPaymentRecoveryInstallmentBalanceTool.execute;
export default farmPaymentRecoveryInstallmentBalanceTool;
