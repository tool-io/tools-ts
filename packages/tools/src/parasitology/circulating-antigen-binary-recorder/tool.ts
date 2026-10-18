import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, observation } from "../batch53-shared.js";

export type Input = Readonly<{
  antigenLine: boolean;
  observationKnown: boolean;
  controlValid: boolean;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "antigenLine", label: "Antigen line", kind: "boolean" },
  { id: "observationKnown", label: "Observation known", kind: "boolean" },
  { id: "controlValid", label: "Control valid", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input, context?: ToolExecutionContext) => {
  return {
    assayObservation: observation(
      i.observationKnown,
      i.antigenLine,
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
  input: { antigenLine: true, observationKnown: true, controlValid: true },
  output: {
    result: {
      assayObservation: "positive",
      diagnosticConclusion: "not-established",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/circulating-antigen-binary-recorder",
  title: "Circulating Filarial Antigen Test Positive-Negative Binary Recorder",
  description:
    "Record independently observed Circulating Filarial Antigen Test Positive-Negative Binary Recorder evidence with explicit knownness and valid controls. Does not inspect images, infer species, diagnose infection or recommend treatment.",
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
