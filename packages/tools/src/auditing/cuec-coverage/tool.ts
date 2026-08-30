import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description: "Audit complementary user-entity control coverage.",
  expected: {
    id: "requiredControls",
    label: "Required complementary user controls",
  },
  example: {
    expected: ["alpha", "beta", "gamma", "delta"],
    observed: ["beta", "alpha", "extra"],
  },
  id: "auditing/cuec-coverage",
  observed: { id: "mappedControls", label: "Mapped controls" },
  title: "CUEC Coverage",
});
export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
