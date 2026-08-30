import { createSetAudit } from "../../core/operational.js";

const operation = createSetAudit({
  description:
    "Compare caller-supplied requirements and observations for beat source coverage.",
  expected: { id: "requiredSourceGroups", label: "Required source groups" },
  example: {
    expected: ["officials", "residents", "subject experts", "affected groups"],
    observed: ["officials", "residents", "affected groups"],
  },
  id: "journalism/beat-source-coverage",
  observed: { id: "coveredSourceGroups", label: "Covered source groups" },
  title: "Beat Source Coverage",
});

export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
