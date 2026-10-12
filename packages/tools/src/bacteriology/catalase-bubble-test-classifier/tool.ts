import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, observation } from "../batch53-shared.js";

export type Input = Readonly<{
  bubbles: boolean;
  observationKnown: boolean;
  controlValid: boolean;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "bubbles", label: "Bubbles", kind: "boolean" },
  { id: "observationKnown", label: "Observation known", kind: "boolean" },
  { id: "controlValid", label: "Control valid", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  return {
    assayObservation: observation(
      i.observationKnown,
      i.bubbles,
      i.controlValid,
    ),
    diagnosticConclusion: "not-established",
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext) => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: { bubbles: true, observationKnown: true, controlValid: true },
  output: {
    result: {
      assayObservation: "positive",
      diagnosticConclusion: "not-established",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "bacteriology/catalase-bubble-test-classifier",
  title: "Catalase Bubble Positive-Negative Test Classifier",
  description:
    "Record independently observed Catalase Bubble Positive-Negative Test Classifier evidence with explicit knownness and valid controls. Does not inspect images, infer species, diagnose infection or recommend treatment.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified evidence",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          assayObservation: { type: "string" },
          diagnosticConclusion: { type: "string" },
        },
        required: ["assayObservation", "diagnosticConclusion"],
      },
    },
  ],
  calculate: (v, context) => calculate(v as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
