import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ConcreteAdmixtureDoseInput = Readonly<{
  readonly cementitiousMassKg: number;
  readonly dosePercent: number;
}>;
export type ConcreteAdmixtureDoseOutput = Readonly<{ admixtureMassKg: number }>;

export const calculateConcreteAdmixtureDose = (
  i: ConcreteAdmixtureDoseInput,
): ConcreteAdmixtureDoseOutput => {
  const value = (i.cementitiousMassKg * i.dosePercent) / 100;
  if (!Number.isFinite(value))
    simpleError("admixtureMassKg", "The inputs produce a non-finite result.");
  return { admixtureMassKg: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { cementitiousMassKg: 400, dosePercent: 0.5 },
  output: { admixtureMassKg: 2 },
} satisfies ToolExample<
  ConcreteAdmixtureDoseInput,
  ConcreteAdmixtureDoseOutput
>;

export const tool = createSimpleTool({
  id: "construction/concrete-admixture-dose",
  title: "Concrete Admixture Dose",
  description:
    "Calculate admixture mass from cementitious material mass and manufacturer-specified dose percentage by mass.",
  inputs: [
    {
      id: "cementitiousMassKg",
      kind: "number",
      label: "Cementitious Mass (kg)",
      unit: "kg",
      minimum: 0,
    },
    {
      id: "dosePercent",
      kind: "number",
      label: "Dose (%)",
      unit: "%",
      minimum: 0,
      maximum: 100,
    },
  ],
  outputs: [
    {
      id: "admixtureMassKg",
      kind: "number",
      label: "Admixture Mass (kg)",
      unit: "kg",
    },
  ],
  calculate: (input) =>
    calculateConcreteAdmixtureDose({
      cementitiousMassKg: input.cementitiousMassKg as number,
      dosePercent: input.dosePercent as number,
    }),
});
export const concreteAdmixtureDoseTool = tool;
export const runConcreteAdmixtureDose = tool.execute;
export default tool;
