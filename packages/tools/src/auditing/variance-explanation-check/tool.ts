import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description:
    "Compare caller-supplied expected and observed records for variance explanation check.",
  expected: { id: "requiredElements", label: "Required explanation elements" },
  example: {
    expected: ["amount", "driver", "period", "evidence"],
    observed: ["amount", "driver", "period"],
  },
  id: "auditing/variance-explanation-check",
  observed: { id: "presentElements", label: "Present explanation elements" },
  title: "Variance Explanation Check",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
