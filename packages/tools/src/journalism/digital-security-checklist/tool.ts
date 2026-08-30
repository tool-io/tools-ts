import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description:
    "Compare caller-supplied requirements and observations for digital security checklist.",
  expected: { id: "requiredControls", label: "Required security controls" },
  example: {
    expected: ["2fa", "password manager", "disk encryption", "vpn"],
    observed: ["2fa", "password manager", "disk encryption"],
  },
  id: "journalism/digital-security-checklist",
  observed: { id: "enabledControls", label: "Enabled controls" },
  title: "Digital Security Checklist",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
