import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, simpleError } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualIndicatedInclinationDegrees: number;
  readonly callerIndependentlyMeasuredInstrumentZeroOffsetDegrees: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndicatedInclinationDegrees",
    label: "Actual indicated inclination degrees",
    kind: "number",
  },
  {
    id: "callerIndependentlyMeasuredInstrumentZeroOffsetDegrees",
    label: "Caller independently measured instrument zero offset degrees",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const a =
    input.actualIndicatedInclinationDegrees -
    input.callerIndependentlyMeasuredInstrumentZeroOffsetDegrees;
  if (
    Math.abs(input.actualIndicatedInclinationDegrees) > 90 ||
    Math.abs(a) > 90
  )
    simpleError("angle", "Actual/correctedinclination±90.");
  return { correctedInclinationDegrees: a };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIndicatedInclinationDegrees: 20,
    callerIndependentlyMeasuredInstrumentZeroOffsetDegrees: 2,
  },
  output: { result: { correctedInclinationDegrees: 18 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/inclination-true-dip-corrector",
  title: "Inclinometer Angle True Dip Corrector",
  description:
    "Instrument zero-offset inclination subtraction only, not apparent dip/strike correction. Actual matched zero calibration externally established.",
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
