import { createSetAudit } from "../../core/operational.js";
const operation = createSetAudit({
  description: "Audit writer, eraser, and reader regulator coverage.",
  expected: {
    id: "requiredRegulatorClasses",
    label: "Required regulator classes",
  },
  example: {
    expected: ["writer", "eraser", "reader"],
    observed: ["writer", "reader"],
  },
  id: "epigenetics/regulator-triad-coverage",
  observed: {
    id: "presentRegulatorClasses",
    label: "Present regulator classes",
  },
  title: "Regulator Triad Coverage",
});
export type Input = Parameters<typeof operation.calculate>[0];
export type Output = ReturnType<typeof operation.calculate>;
export const calculate = operation.calculate;
export const example = operation.example;
export const tool = operation.tool;
export const run = tool.execute;
export default tool;
