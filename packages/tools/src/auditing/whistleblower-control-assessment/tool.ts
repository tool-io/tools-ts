import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description:
    "Compare caller-supplied expected and observed records for whistleblower control assessment.",
  expected: {
    id: "requiredControls",
    label: "Required whistleblower controls",
  },
  example: {
    expected: ["independent intake", "anti-retaliation", "case tracking"],
    observed: ["independent intake", "case tracking"],
  },
  id: "auditing/whistleblower-control-assessment",
  observed: { id: "implementedControls", label: "Implemented controls" },
  title: "Whistleblower Control Assessment",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
