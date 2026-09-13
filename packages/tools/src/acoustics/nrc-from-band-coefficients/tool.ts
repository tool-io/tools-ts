import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  fraction,
  mean,
} from "../batch51-shared.js";
export type Input = Readonly<{
  readonly actualAbsorptionCoefficients25050010002000Hz: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualAbsorptionCoefficients25050010002000Hz",
    label: "Actual absorption coefficients25050010002000 hz",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (
  input: Input,
  context?: ToolExecutionContext,
): Readonly<Record<string, unknown>> => {
  if (!input.actualAbsorptionCoefficients25050010002000Hz.length)
    simpleError(
      "actualAbsorptionCoefficients25050010002000Hz",
      "Actualnonemptyobservations.",
    );
  input.actualAbsorptionCoefficients25050010002000Hz.forEach((v) =>
    fraction(v, "actualAbsorptionCoefficients25050010002000Hz"),
  );
  if (input.actualAbsorptionCoefficients25050010002000Hz.length !== 4)
    simpleError("bands", "Fouractualmatchedbands.");
  return {
    value:
      Math.round(
        mean(input.actualAbsorptionCoefficients25050010002000Hz) / 0.05,
      ) * 0.05,
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
  input: { actualAbsorptionCoefficients25050010002000Hz: [0.2, 0.4, 0.6, 0.8] },
  output: { result: { value: 0.5 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "acoustics/nrc-from-band-coefficients",
  title: "NRC From Band Coefficients Calculator",
  description:
    "DeclaredNRCroundednearest0.05meanactual4bandabsorptionat250/500/1000/2000Hz;not allfreqSAA or roomreverberation. Actual matched calibration,units,edition,geometry/measurement and model applicability independently established;not hearing/structural safety,compliance or universal perceptual prediction.",
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
