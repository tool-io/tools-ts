import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description:
    "Compare required payroll reporting duties with duties assigned to the payroll agent.",
  expected: { id: "requiredDuties", label: "Required reporting duties" },
  example: {
    expected: ["deposit taxes", "file returns", "retain records"],
    observed: ["file returns", "deposit taxes"],
  },
  observed: { id: "assignedDuties", label: "Assigned agent duties" },
  id: "taxation/payroll-reporting-coverage",
  title: "Payroll Reporting Coverage",
});
export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
