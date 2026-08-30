import { createRiskScreen } from "../../core/operational.js";

const operation = createRiskScreen({
  description:
    "Summarize caller-observed indicators for money mule red-flag screen without treating the result as conclusive.",
  example: {
    forwardFunds: true,
    keepCommission: true,
    usePersonalAccount: false,
    urgentSecrecy: false,
  },
  highRiskAt: 2,
  id: "banking/money-mule-red-flag-screen",
  indicators: [
    { id: "forwardFunds", label: "Asked to forward received funds" },
    { id: "keepCommission", label: "Offered commission for transfers" },
    { id: "usePersonalAccount", label: "Asked to use a personal account" },
    { id: "urgentSecrecy", label: "Urgency or secrecy requested" },
  ],
  title: "Money Mule Red-Flag Screen",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
