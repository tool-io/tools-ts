import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description:
    "Compare caller-supplied expected and observed records for robots policy check.",
  expected: { id: "requiredDirectives", label: "Required robots directives" },
  example: {
    expected: ["user-agent", "disallow", "crawl-delay"],
    observed: ["user-agent", "disallow"],
  },
  id: "journalism/robots-policy-check",
  observed: { id: "observedDirectives", label: "Observed directives" },
  title: "Robots Policy Check",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
