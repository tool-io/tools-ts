import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredValue: number;
  readonly callerApplicableLowerValue: number;
  readonly callerApplicableUpperValue: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredValue",
    label: "Independently measured value",
    kind: "number",
  },
  {
    id: "callerApplicableLowerValue",
    label: "Caller applicable lower value",
    kind: "number",
  },
  {
    id: "callerApplicableUpperValue",
    label: "Caller applicable upper value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (input.callerApplicableUpperValue < input.callerApplicableLowerValue)
    simpleError("range", "Independently applicable ordered same-unit screen.");
  return {
    withinCallerScreen:
      input.independentlyMeasuredValue >= input.callerApplicableLowerValue &&
      input.independentlyMeasuredValue <= input.callerApplicableUpperValue,
    signedLowerMargin:
      input.independentlyMeasuredValue - input.callerApplicableLowerValue,
    signedUpperMargin:
      input.callerApplicableUpperValue - input.independentlyMeasuredValue,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredValue: 50,
    callerApplicableLowerValue: 30,
    callerApplicableUpperValue: 70,
  },
  output: {
    result: {
      withinCallerScreen: true,
      signedLowerMargin: 20,
      signedUpperMargin: 20,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/umbilical-cord-length-normal",
  title: "Umbilical Cord Length Normal Checker",
  description:
    "Actual independently measured umbilical-cord length in centimeters relative only to independently applicable caller bounds. Inclusive endpoints, signed margins; method, context, age/state and uncertainty must be independently established. No universal normal range, diagnosis, intervention or safe-use approval.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
