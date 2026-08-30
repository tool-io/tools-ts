import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description: "Audit synthetic-voice disclosure coverage.",
  expected: { id: "requiredDisclosures", label: "Required voice disclosures" },
  example: {
    expected: ["alpha", "beta", "gamma"],
    observed: ["beta", "alpha", "extra"],
  },
  id: "journalism/synthetic-voice-disclosure",
  observed: { id: "presentDisclosures", label: "Present voice disclosures" },
  title: "Synthetic Voice Disclosure",
});
export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
