import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, fraction } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly topCycleEfficiency: number;
  readonly independentlyEstablishedRecoverableBottomFraction: number;
  readonly bottomCycleEfficiency: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "topCycleEfficiency", label: "Top cycle efficiency", kind: "number" },
  {
    id: "independentlyEstablishedRecoverableBottomFraction",
    label: "Independently established recoverable bottom fraction",
    kind: "number",
  },
  {
    id: "bottomCycleEfficiency",
    label: "Bottom cycle efficiency",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  fraction(input.topCycleEfficiency, "topCycleEfficiency");
  fraction(
    input.independentlyEstablishedRecoverableBottomFraction,
    "independentlyEstablishedRecoverableBottomFraction",
  );
  fraction(input.bottomCycleEfficiency, "bottomCycleEfficiency");
  return {
    value:
      input.topCycleEfficiency +
      (1 - input.topCycleEfficiency) *
        input.independentlyEstablishedRecoverableBottomFraction *
        input.bottomCycleEfficiency,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    topCycleEfficiency: 0.4,
    independentlyEstablishedRecoverableBottomFraction: 0.5,
    bottomCycleEfficiency: 0.3333333333333333,
  },
  output: { result: { value: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/combined-cycle-efficiency",
  title: "Combined Cycle Efficiency Calculator",
  description:
    "Ideal combined cycle accounting\u03b7top+(1\u2212\u03b7top) recovered fraction\u03b7bottom; independent compatible energy denominators/auxiliary losses external. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
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
