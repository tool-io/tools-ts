import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, nonnegative } from "../batch49-shared.js";
export type Input = Readonly<{
  readonly callerIndependentlyEstablishedNetUpliftPressurePascals: number;
  readonly actualTributaryRoofAreaSquareMeters: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "callerIndependentlyEstablishedNetUpliftPressurePascals",
    label: "Caller independently established net uplift pressure pascals",
    kind: "number",
  },
  {
    id: "actualTributaryRoofAreaSquareMeters",
    label: "Actual tributary roof area square meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  nonnegative(
    input.actualTributaryRoofAreaSquareMeters,
    "actualTributaryRoofAreaSquareMeters",
  );
  return {
    value:
      input.callerIndependentlyEstablishedNetUpliftPressurePascals *
      input.actualTributaryRoofAreaSquareMeters,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerIndependentlyEstablishedNetUpliftPressurePascals: 10,
    actualTributaryRoofAreaSquareMeters: 2,
  },
  output: { result: { value: 20 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "engineering/wind-uplift-roof-2",
  title: "Roof Wind Uplift Calculator",
  description:
    "Actual independently governing net roof uplift pressure\u00d7tributary area, not select wind zone/pressure coefficients or anchor design. Actual independently established compatible SI units/model context; conditional arithmetic, not code compliance, engineering design or safe operation approval.",
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
