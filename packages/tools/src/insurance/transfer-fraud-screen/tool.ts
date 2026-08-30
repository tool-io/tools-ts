import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly executiveImpersonation: boolean;
  readonly paymentInstructionChanged: boolean;
  readonly outOfBandVerified: boolean;
  readonly fundsTransferred: boolean;
  readonly recoveryAttempted: boolean;
}>;
export type Output = Readonly<{
  readonly riskScore: number;
  readonly status: string;
  readonly urgentAction: boolean;
}>;

export const calculate = (input: Input): Output => {
  const riskScore =
    (input.executiveImpersonation ? 3 : 0) +
    (input.paymentInstructionChanged ? 2 : 0) +
    (input.fundsTransferred ? 3 : 0) -
    (input.outOfBandVerified ? 3 : 0) -
    (input.recoveryAttempted ? 1 : 0);
  const status = input.fundsTransferred
    ? input.recoveryAttempted
      ? "incident-response"
      : "incident"
    : riskScore >= 3
      ? "blocked"
      : "low-risk";
  return {
    riskScore: Math.max(0, riskScore),
    status,
    urgentAction: input.fundsTransferred && !input.recoveryAttempted,
  };
};

export const exampleInput = {
  executiveImpersonation: true,
  paymentInstructionChanged: true,
  outOfBandVerified: false,
  fundsTransferred: true,
  recoveryAttempted: false,
} satisfies Input;
export const exampleOutput = {
  riskScore: 8,
  status: "incident",
  urgentAction: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      executiveImpersonation: input.executiveImpersonation as boolean,
      paymentInstructionChanged: input.paymentInstructionChanged as boolean,
      outOfBandVerified: input.outOfBandVerified as boolean,
      fundsTransferred: input.fundsTransferred as boolean,
      recoveryAttempted: input.recoveryAttempted as boolean,
    }),
  description:
    "Screen payment facts for funds-transfer fraud and response urgency.",
  id: "insurance/transfer-fraud-screen",
  inputs: [
    {
      id: "executiveImpersonation",
      label: "Executive impersonation",
      kind: "boolean",
    },
    {
      id: "paymentInstructionChanged",
      label: "Payment instructions changed",
      kind: "boolean",
    },
    {
      id: "outOfBandVerified",
      label: "Out-of-band verification completed",
      kind: "boolean",
    },
    { id: "fundsTransferred", label: "Funds transferred", kind: "boolean" },
    { id: "recoveryAttempted", label: "Recovery attempted", kind: "boolean" },
  ],
  outputs: [
    {
      id: "riskScore",
      label: "Transfer-fraud risk score",
      kind: "integer",
      minimum: 0,
    },
    {
      id: "status",
      label: "Transfer-fraud status",
      kind: "string",
      enum: ["low-risk", "blocked", "incident", "incident-response"],
    },
    { id: "urgentAction", label: "Urgent action recommended", kind: "boolean" },
  ],
  title: "Transfer-Fraud Screen",
});

export const run = tool.execute;
export default tool;
