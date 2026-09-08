import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
} from "../batch46-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredPolyesterThicknessMil: number;
  readonly callerApplicableMinimumThicknessMil: number;
  readonly callerApplicableMaximumThicknessMil: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredPolyesterThicknessMil",
    label: "Independently measured polyester thickness mil",
    kind: "number",
  },
  {
    id: "callerApplicableMinimumThicknessMil",
    label: "Caller applicable minimum thickness mil",
    kind: "number",
  },
  {
    id: "callerApplicableMaximumThicknessMil",
    label: "Caller applicable maximum thickness mil",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.independentlyMeasuredPolyesterThicknessMil, "thickness");
  positive(input.callerApplicableMinimumThicknessMil, "minimum");
  if (
    input.callerApplicableMaximumThicknessMil <
    input.callerApplicableMinimumThicknessMil
  )
    simpleError("range", "Ordered independently applicable thickness window.");
  return {
    observedThicknessMicrometers:
      25.4 * input.independentlyMeasuredPolyesterThicknessMil,
    withinCallerThicknessWindow:
      input.independentlyMeasuredPolyesterThicknessMil >=
        input.callerApplicableMinimumThicknessMil &&
      input.independentlyMeasuredPolyesterThicknessMil <=
        input.callerApplicableMaximumThicknessMil,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredPolyesterThicknessMil: 3,
    callerApplicableMinimumThicknessMil: 2,
    callerApplicableMaximumThicknessMil: 4,
  },
  output: {
    result: {
      observedThicknessMicrometers: 76.2,
      withinCallerThicknessWindow: true,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/mylar-thickness-grade-checker",
  title: "Mylar Polyester Thickness mil Preservation Grade Checker",
  description:
    "Actual polyester-film thickness mil-to-\u00b5mconversion and caller window only. Mylar is a trade name; thickness does not identify polyester, additives, static effects, archival grade or suitability.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
