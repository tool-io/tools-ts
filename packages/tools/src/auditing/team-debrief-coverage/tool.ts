import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description: "Audit engagement debrief topic coverage.",
  expected: { id: "requiredTopics", label: "Required debrief topics" },
  example: {
    expected: ["alpha", "beta", "gamma", "delta"],
    observed: ["beta", "alpha", "extra"],
  },
  id: "auditing/team-debrief-coverage",
  observed: { id: "coveredTopics", label: "Covered topics" },
  title: "Team-Debrief Coverage",
});
export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
