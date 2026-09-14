import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError, pick } from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyIdentifiedNumericPennantLabels: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyIdentifiedNumericPennantLabels",
    label: "Actual independently identified numeric pennant labels",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  const t = {
    zero: "0",
    one: "1",
    two: "2",
    three: "3",
    four: "4",
    five: "5",
    six: "6",
    seven: "7",
    eight: "8",
    nine: "9",
  };
  if (!input.actualIndependentlyIdentifiedNumericPennantLabels.length)
    simpleError("pennants", "Actualalready identifiedpennantlabels.");
  return {
    decodedDecimalDigits:
      input.actualIndependentlyIdentifiedNumericPennantLabels
        .map((v) => pick(v, t, "pennant"))
        .join(""),
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
  input: {
    actualIndependentlyIdentifiedNumericPennantLabels: ["one", "zero", "three"],
  },
  output: { result: { decodedDecimalDigits: "103" } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/numeric-pennant-decoder",
  title: "Numeric Pennant Value Decoder",
  description:
    "LiteralalreadyidentifiedICSdecimalnumericpennantlabelflow,leadingzerosretained,not visualflagrecognition/multigroupinterpretation. Actual independently applicable flag/cloth/manufacturer/jurisdiction/protocol/sourceedition,units/calibration and observations external;not legal/display precedence,authenticity,visibility or structural safety approval.",
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
