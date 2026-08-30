import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ConcreteRetarderDoseInput = Readonly<{
  readonly binderKilograms: number;
  readonly dosagePercent: number;
}>;
export type ConcreteRetarderDoseOutput = Readonly<{
  readonly retarderKilograms: number;
}>;

export const calculateConcreteRetarderDose = (
  x: ConcreteRetarderDoseInput,
): ConcreteRetarderDoseOutput => {
  if (!Number.isFinite(x.binderKilograms) || x.binderKilograms < 0)
    simpleError("binderKilograms", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.dosagePercent) || x.dosagePercent < 0)
    simpleError("dosagePercent", "Provide a finite number at least 0.");
  const retarderKilograms = (x.binderKilograms * x.dosagePercent) / 100;
  if (!Number.isFinite(retarderKilograms))
    simpleError(
      "retarderKilograms",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    retarderKilograms: Object.is(retarderKilograms, -0) ? 0 : retarderKilograms,
  };
};

export const example = {
  input: { binderKilograms: 1000, dosagePercent: 0.5 },
  output: { retarderKilograms: 5 },
} satisfies ToolExample<ConcreteRetarderDoseInput, ConcreteRetarderDoseOutput>;

export const tool = createSimpleTool({
  id: "construction/concrete-retarder-dose",
  title: "Concrete Retarder Dose",
  description:
    "Retarder mass from cementitious binder mass and a manufacturer-specified dosage percentage by binder mass.",
  inputs: [
    {
      id: "binderKilograms",
      kind: "number",
      label: "Binder Kilograms",
      unit: "kg",
      minimum: 0,
    },
    {
      id: "dosagePercent",
      kind: "number",
      label: "Dosage Percent",
      unit: "%",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "retarderKilograms",
      kind: "number",
      label: "Retarder Kilograms",
      unit: "kg",
    },
  ],
  calculate: (input) =>
    calculateConcreteRetarderDose({
      binderKilograms: input.binderKilograms as number,
      dosagePercent: input.dosagePercent as number,
    }),
});
export const concreteRetarderDoseTool = tool;
export const runConcreteRetarderDose = tool.execute;
export default tool;
