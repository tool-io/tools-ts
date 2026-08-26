import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const formBendingSpringbackExample = {
  input: { formRadiusMm: 600, springbackPercent: 25 },
  output: { actualRadiusMm: 750 },
} satisfies ToolExample<
  { readonly formRadiusMm: number; readonly springbackPercent: number },
  { readonly actualRadiusMm: number }
>;

export const formBendingSpringbackTool = createSimpleTool({
  id: "carpentry/formverleimung-radius-rueckfederung",
  title: "Form Bending Springback Calculator",
  description:
    "Compute the actual radius of a bent workpiece after springback on a bending form.",
  inputs: [
    {
      description: "Radius of the bending form in millimeters.",
      id: "formRadiusMm",
      kind: "number",
      label: "Form radius",
      unit: "mm",
    },
    {
      default: 8,
      description: "Expected springback as a percentage of the form radius.",
      id: "springbackPercent",
      kind: "number",
      label: "Springback",
      maximum: 30,
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      description: "Actual radius after springback in millimeters.",
      id: "actualRadiusMm",
      kind: "number",
      label: "Actual radius",
      unit: "mm",
    },
  ],
  calculate: (input) => {
    const formRadiusMm = input.formRadiusMm as number;
    const springbackPercent = input.springbackPercent as number;
    if (formRadiusMm <= 0)
      simpleError(
        "formRadiusMm",
        "Form radius must be positive.",
        "must_be_positive",
      );
    return {
      actualRadiusMm: formRadiusMm * (1 + springbackPercent / 100),
    };
  },
});
export const runFormBendingSpringback = formBendingSpringbackTool.execute;
export default formBendingSpringbackTool;
