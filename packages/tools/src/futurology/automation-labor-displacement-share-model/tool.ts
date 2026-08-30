import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type AutomationDisplacementInput = {
  readonly adoptionPercent: number;
  readonly automatableSharePercent: number;
  readonly executionPercent: number;
};

export type AutomationDisplacementOutput = {
  readonly displacedSharePercent: number;
  readonly retainedAtRiskSharePercent: number;
  readonly unaffectedSharePercent: number;
};

export const modelAutomationDisplacementShare = (
  input: AutomationDisplacementInput,
): AutomationDisplacementOutput => {
  const percentages = [
    ["adoptionPercent", input.adoptionPercent],
    ["automatableSharePercent", input.automatableSharePercent],
    ["executionPercent", input.executionPercent],
  ] as const;
  for (const [field, value] of percentages)
    if (!Number.isFinite(value) || value < 0 || value > 100)
      simpleError(
        field,
        "Percentages must be finite and between 0 and 100.",
        "percentage_out_of_range",
      );
  const displacedSharePercent =
    (input.automatableSharePercent *
      input.adoptionPercent *
      input.executionPercent) /
    10_000;
  if (!Number.isFinite(displacedSharePercent))
    simpleError(
      "",
      "The displacement share is not finite.",
      "result_not_finite",
    );
  return {
    displacedSharePercent,
    retainedAtRiskSharePercent:
      (input.automatableSharePercent * input.adoptionPercent) / 100 -
      displacedSharePercent,
    unaffectedSharePercent: 100 - input.automatableSharePercent,
  };
};

export const automationDisplacementExample = {
  input: {
    adoptionPercent: 75,
    automatableSharePercent: 40,
    executionPercent: 80,
  },
  output: {
    displacedSharePercent: 24,
    retainedAtRiskSharePercent: 6,
    unaffectedSharePercent: 60,
  },
} satisfies ToolExample<
  AutomationDisplacementInput,
  AutomationDisplacementOutput
>;

export const automationDisplacementTool = createSimpleTool({
  calculate: (input) =>
    modelAutomationDisplacementShare({
      adoptionPercent: input.adoptionPercent as number,
      automatableSharePercent: input.automatableSharePercent as number,
      executionPercent: input.executionPercent as number,
    }),
  description:
    "Estimate labor displacement and retained at-risk shares from caller-supplied automation, adoption, and execution percentages.",
  id: "futurology/automation-labor-displacement-share-model",
  inputs: [
    {
      id: "adoptionPercent",
      kind: "number",
      label: "Adoption percent",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      id: "automatableSharePercent",
      kind: "number",
      label: "Automatable share percent",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      id: "executionPercent",
      kind: "number",
      label: "Execution percent",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
  ],
  outputs: [
    {
      id: "displacedSharePercent",
      kind: "number",
      label: "Displaced share percent",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      id: "retainedAtRiskSharePercent",
      kind: "number",
      label: "Retained at-risk share percent",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
    {
      id: "unaffectedSharePercent",
      kind: "number",
      label: "Unaffected share percent",
      maximum: 100,
      minimum: 0,
      unit: "%",
    },
  ],
  title: "Automation Labor Displacement Share Model",
});

export const runAutomationDisplacement = automationDisplacementTool.execute;
export default automationDisplacementTool;
