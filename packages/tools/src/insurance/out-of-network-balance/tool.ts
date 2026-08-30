import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly billedCharge: number;
  readonly recognizedAmount: number;
  readonly patientCostSharePercent: number;
  readonly patientPaymentsMade: number;
}>;
export type Output = Readonly<{
  readonly allowedPatientCostShare: number;
  readonly potentialBalanceBill: number;
  readonly patientRefundDue: number;
  readonly providerPaymentGap: number;
}>;

export const calculate = (input: Input): Output => {
  const allowedPatientCostShare =
      (input.recognizedAmount * input.patientCostSharePercent) / 100,
    potentialBalanceBill = Math.max(
      0,
      input.billedCharge - input.recognizedAmount,
    );
  return {
    allowedPatientCostShare,
    potentialBalanceBill,
    patientRefundDue: Math.max(
      0,
      input.patientPaymentsMade - allowedPatientCostShare,
    ),
    providerPaymentGap: potentialBalanceBill,
  };
};

export const exampleInput = {
  billedCharge: 1000,
  recognizedAmount: 600,
  patientCostSharePercent: 20,
  patientPaymentsMade: 200,
} satisfies Input;
export const exampleOutput = {
  allowedPatientCostShare: 120,
  potentialBalanceBill: 400,
  patientRefundDue: 80,
  providerPaymentGap: 400,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      billedCharge: input.billedCharge as number,
      recognizedAmount: input.recognizedAmount as number,
      patientCostSharePercent: input.patientCostSharePercent as number,
      patientPaymentsMade: input.patientPaymentsMade as number,
    }),
  description:
    "Separate recognized cost share from a potential out-of-network balance bill.",
  id: "insurance/out-of-network-balance",
  inputs: [
    {
      id: "billedCharge",
      label: "Out-of-network billed charge",
      kind: "number",
      minimum: 0,
    },
    {
      id: "recognizedAmount",
      label: "Recognized amount",
      kind: "number",
      minimum: 0,
    },
    {
      id: "patientCostSharePercent",
      label: "Patient cost share",
      kind: "number",
      minimum: 0,
      maximum: 100,
      unit: "%",
    },
    {
      id: "patientPaymentsMade",
      label: "Patient payments made",
      kind: "number",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "allowedPatientCostShare",
      label: "Allowed patient cost share",
      kind: "number",
      minimum: 0,
    },
    {
      id: "potentialBalanceBill",
      label: "Potential balance bill",
      kind: "number",
      minimum: 0,
    },
    {
      id: "patientRefundDue",
      label: "Potential patient refund",
      kind: "number",
      minimum: 0,
    },
    {
      id: "providerPaymentGap",
      label: "Billed charge less recognized amount",
      kind: "number",
      minimum: 0,
    },
  ],
  title: "Out-of-Network Balance",
});

export const run = tool.execute;
export default tool;
