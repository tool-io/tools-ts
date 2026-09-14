import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualObservedCranidiumLength: number;
  readonly actualObservedCranidiumWidth: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualObservedCranidiumLength",
    label: "Actual observed cranidium length",
    kind: "number",
  },
  {
    id: "actualObservedCranidiumWidth",
    label: "Actual observed cranidium width",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(
    input.actualObservedCranidiumLength,
    "actualObservedCranidiumLength",
  );
  positive(input.actualObservedCranidiumWidth, "actualObservedCranidiumWidth");
  return {
    value:
      input.actualObservedCranidiumLength / input.actualObservedCranidiumWidth,
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
  input: { actualObservedCranidiumLength: 4, actualObservedCranidiumWidth: 2 },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/trilobite-cranidium-ratio",
  title: "Trilobite Cranidium Length Width Ratio Classifier",
  description:
    "Actual trilobitecranidiumlength/widthratioONLY,not taxon/environmentclassificationwithoutindependent rubric. Actual independently identified specimens,matched units/taxon/cohort/source/edition/calibration and model applicability external;not individual identity,causation,diagnosis,absolute age certainty or validated forecast.",
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
