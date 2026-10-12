import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyQualifiedOxidizedAmmoniumMoles: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualIndependentlyQualifiedOxidizedAmmoniumMoles",
    label: "Actual independently qualified oxidized ammonium moles",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  nonnegative(
    input.actualIndependentlyQualifiedOxidizedAmmoniumMoles,
    "actualIndependentlyQualifiedOxidizedAmmoniumMoles",
  );
  return { value: 2 * input.actualIndependentlyQualifiedOxidizedAmmoniumMoles };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualIndependentlyQualifiedOxidizedAmmoniumMoles: 2 },
  output: { result: { value: 4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "aquaculture/alkalinity-consumption-nitrification",
  title: "Alkalinity Consumption Nitrification Calculator",
  description:
    "Ideal complete NH4+\u2192NO3\u2212nitrification2equivalents alkalinity consumption permoleN, assimilation/side pathways excluded, no process causality from TAN loss alone.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
