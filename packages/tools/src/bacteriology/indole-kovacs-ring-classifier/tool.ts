import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, observation } from "../batch53-shared.js";

export type Input = Readonly<{
  redReagentRing: boolean;
  observationKnown: boolean;
  controlValid: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "redReagentRing", label: "Red reagent ring", kind: "boolean" },
  { id: "observationKnown", label: "Observation known", kind: "boolean" },
  { id: "controlValid", label: "Control valid", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  return {
    assayObservation: observation(
      i.observationKnown,
      i.redReagentRing,
      i.controlValid,
    ),
    diagnosticConclusion: "not-established",
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { redReagentRing: true, observationKnown: true, controlValid: true },
  output: {
    result: {
      assayObservation: "positive",
      diagnosticConclusion: "not-established",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/indole-kovacs-ring-classifier",
  title: "Indole Tryptophan Kovacs Reagent Ring Classifier",
  description:
    "Record independently observed Indole Tryptophan Kovacs Reagent Ring Classifier evidence with explicit knownness and valid controls. Does not inspect images, infer species, diagnose infection or recommend treatment.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
