import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualHaulLoadWeightNewtons: number;
  readonly actualCounterweightWeightNewtons: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualHaulLoadWeightNewtons",
    label: "Actual haul load weight newtons",
    kind: "number",
  },
  {
    id: "actualCounterweightWeightNewtons",
    label: "Actual counterweight weight newtons",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualHaulLoadWeightNewtons, "load");
  nonnegative(input.actualCounterweightWeightNewtons, "counterweight");
  return {
    conditionalIdealRemainingHaulForceNewtons:
      input.actualHaulLoadWeightNewtons -
      input.actualCounterweightWeightNewtons,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualHaulLoadWeightNewtons: 100,
    actualCounterweightWeightNewtons: 30,
  },
  output: { result: { conditionalIdealRemainingHaulForceNewtons: 70 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/counterweight-haul-advantage",
  title: "Counterweight Assist Haul Advantage Calculator",
  description:
    "Ideal one-to-one vertical counterweight force difference, signed overbalance retained. No actual friction/dynamic load, safe mechanical system or pulley topology inferred.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observed calculation or explicit reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
