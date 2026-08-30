import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ConcreteAcceleratorDoseInput = Readonly<{
  readonly binderKilograms: number;
  readonly dosagePercent: number;
}>;
export type ConcreteAcceleratorDoseOutput = Readonly<{
  readonly acceleratorKilograms: number;
}>;

export const calculateConcreteAcceleratorDose = (
  x: ConcreteAcceleratorDoseInput,
): ConcreteAcceleratorDoseOutput => {
  if (!Number.isFinite(x.binderKilograms) || x.binderKilograms < 0)
    simpleError("binderKilograms", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.dosagePercent) || x.dosagePercent < 0)
    simpleError("dosagePercent", "Provide a finite number at least 0.");
  const acceleratorKilograms = (x.binderKilograms * x.dosagePercent) / 100;
  if (!Number.isFinite(acceleratorKilograms))
    simpleError(
      "acceleratorKilograms",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    acceleratorKilograms: Object.is(acceleratorKilograms, -0)
      ? 0
      : acceleratorKilograms,
  };
};

export const example = {
  input: { binderKilograms: 1000, dosagePercent: 1 },
  output: { acceleratorKilograms: 10 },
} satisfies ToolExample<
  ConcreteAcceleratorDoseInput,
  ConcreteAcceleratorDoseOutput
>;

export const tool = createSimpleTool({
  id: "construction/concrete-accelerator-dose",
  title: "Concrete Accelerator Dose",
  description:
    "Accelerator mass from cementitious binder mass and a manufacturer-specified dosage percentage; compatibility and limits are outside this calculation.",
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
      id: "acceleratorKilograms",
      kind: "number",
      label: "Accelerator Kilograms",
      unit: "kg",
    },
  ],
  calculate: (input) =>
    calculateConcreteAcceleratorDose({
      binderKilograms: input.binderKilograms as number,
      dosagePercent: input.dosagePercent as number,
    }),
});
export const concreteAcceleratorDoseTool = tool;
export const runConcreteAcceleratorDose = tool.execute;
export default tool;
