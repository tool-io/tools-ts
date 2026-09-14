import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualObservedValveLength: number;
  readonly actualObservedValveHeight: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualObservedValveLength",
    label: "Actual observed valve length",
    kind: "number",
  },
  {
    id: "actualObservedValveHeight",
    label: "Actual observed valve height",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  positive(input.actualObservedValveLength, "actualObservedValveLength");
  positive(input.actualObservedValveHeight, "actualObservedValveHeight");
  return {
    value: input.actualObservedValveLength / input.actualObservedValveHeight,
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
  input: { actualObservedValveLength: 4, actualObservedValveHeight: 2 },
  output: { result: { value: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "paleontology/ostracod-valve-aspect",
  title: "Ostracod Valve Length-Height Aspect Classifier",
  description:
    "Actual ostracodvalvelength/heightratioONLY,not taxon/environmentclassificationwithoutindependent rubric. Actual independently identified specimens,matched units/taxon/cohort/source/edition/calibration and model applicability external;not individual identity,causation,diagnosis,absolute age certainty or validated forecast.",
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
