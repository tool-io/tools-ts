import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualLaterObservedFrontPosition: number;
  readonly actualEarlierObservedFrontPosition: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualLaterObservedFrontPosition",
    label: "Actual later observed front position",
    kind: "number",
  },
  {
    id: "actualEarlierObservedFrontPosition",
    label: "Actual earlier observed front position",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext) => {
  return {
    value:
      input.actualLaterObservedFrontPosition -
      input.actualEarlierObservedFrontPosition,
  };
};
export const calculate = (input: Input, context?: ToolExecutionContext) => {
  validateInput(input, fields);
  return finish({ result: compute(input, context) });
};
export const example = {
  input: {
    actualLaterObservedFrontPosition: 8,
    actualEarlierObservedFrontPosition: 10,
  },
  output: { result: { value: -2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "glaciology/front-position-change-between-years",
  title: "Front Position Change Between Years Calculator",
  description:
    "Signedactualfront-positionchangealongindependentlysurveyedcommonpositiveadvancetransect,not velocityor dateinterp. Actual independent units,calibration,measurement definitions/coverage and model applicability;not a climate forecast,causal determination,geodesy operation or safe travel/design approval.",
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
