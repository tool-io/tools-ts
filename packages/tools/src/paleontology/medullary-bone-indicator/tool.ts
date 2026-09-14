import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyVerifiedMedullaryBoneEvidence: boolean;
  readonly actualIndependentReproductiveContextEvidenceKnown: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyVerifiedMedullaryBoneEvidence",
    label: "Actual independently verified medullary bone evidence",
    kind: "boolean",
  },
  {
    id: "actualIndependentReproductiveContextEvidenceKnown",
    label: "Actual independent reproductive context evidence known",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  return {
    observedMedullaryBoneEvidence:
      input.actualIndependentlyVerifiedMedullaryBoneEvidence,
    reproductiveContextStatus:
      input.actualIndependentReproductiveContextEvidenceKnown
        ? "independent-context-requires-specialist-interpretation"
        : "unknown-not-a-pregnancy-diagnosis",
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualIndependentlyVerifiedMedullaryBoneEvidence: true,
    actualIndependentReproductiveContextEvidenceKnown: false,
  },
  output: {
    result: {
      observedMedullaryBoneEvidence: true,
      reproductiveContextStatus: "unknown-not-a-pregnancy-diagnosis",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/medullary-bone-indicator",
  title: "Medullary Bone Pregnancy Indicator Flag",
  description:
    "Recordindependently verifiedmedullarybonemorphologicalevidenceandexternalcontextKNOWNstatus,no determinespregnancy,humansexor dinosaurindividualstatefromflag. Actual independently identified specimens,matched units/taxon/cohort/source/edition/calibration and model applicability external;not individual identity,causation,diagnosis,absolute age certainty or validated forecast.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
