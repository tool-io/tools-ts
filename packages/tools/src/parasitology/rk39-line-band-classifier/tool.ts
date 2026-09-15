import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, observation } from "../batch53-shared.js";

export type Input = Readonly<{
  testLinePresent: boolean;
  controlLinePresent: boolean;
  observationKnown: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "testLinePresent", label: "Test line present", kind: "boolean" },
  { id: "controlLinePresent", label: "Control line present", kind: "boolean" },
  { id: "observationKnown", label: "Observation known", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (
  i: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  return {
    result: observation(
      i.observationKnown,
      i.testLinePresent,
      i.controlLinePresent,
    ),
    lineIntensityPredictsDiseaseSeverity: false,
  };
};
export const calculate = (i: Input, context?: ToolExecutionContext): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i, context) });
};
export const example = {
  input: {
    testLinePresent: true,
    controlLinePresent: true,
    observationKnown: true,
  },
  output: {
    result: { result: "positive", lineIntensityPredictsDiseaseSeverity: false },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "parasitology/rk39-line-band-classifier",
  title: "rK39 Rapid Test Line Intensity Band Classifier",
  description:
    "Classify observed rK39 line presence with explicit control validity; intensity is not a disease-severity calibration.",
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
