import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualMembraneRadius: number;
  readonly actualUniformTensionPerLength: number;
  readonly actualMembraneMassPerArea: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualMembraneRadius",
    label: "Actual membrane radius",
    kind: "number",
  },
  {
    id: "actualUniformTensionPerLength",
    label: "Actual uniform tension per length",
    kind: "number",
  },
  {
    id: "actualMembraneMassPerArea",
    label: "Actual membrane mass per area",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  positive(input.actualMembraneRadius, "actualMembraneRadius");
  positive(
    input.actualUniformTensionPerLength,
    "actualUniformTensionPerLength",
  );
  positive(input.actualMembraneMassPerArea, "actualMembraneMassPerArea");
  return {
    value:
      (2.404825557695773 / (2 * Math.PI * input.actualMembraneRadius)) *
      Math.sqrt(
        input.actualUniformTensionPerLength / input.actualMembraneMassPerArea,
      ),
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualMembraneRadius: 1,
    actualUniformTensionPerLength: 1,
    actualMembraneMassPerArea: 1,
  },
  output: { result: { value: 0.38273987478100624 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "acoustics/circular-membrane-fundamental",
  title: "Circular Membrane Fundamental Calculator",
  description:
    "IdealclampedcircularmembraneaxisymmetricfundamentalfromfirstJ0zero,radiusnotdiameter,not flexuralplate. Actual matched calibration,units,edition,geometry/measurement and model applicability independently established;not hearing/structural safety,compliance or universal perceptual prediction.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value, context) => calculate(value as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
