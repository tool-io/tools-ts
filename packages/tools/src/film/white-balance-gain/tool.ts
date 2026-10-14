import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualNeutralPatchLinearRgb: readonly number[];
  readonly callerChosenNeutralReferenceValue: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualNeutralPatchLinearRgb",
    label: "Actual neutral patch linear rgb",
    kind: "numberList",
  },
  {
    id: "callerChosenNeutralReferenceValue",
    label: "Caller chosen neutral reference value",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  if (input.actualNeutralPatchLinearRgb.length !== 3)
    simpleError("RGB", "ActualthreepositiveLINEARchannelmeans.");
  input.actualNeutralPatchLinearRgb.forEach((v) => positive(v, "channel"));
  positive(input.callerChosenNeutralReferenceValue, "reference");
  return {
    conditionalRgbMultiplicativeGains: input.actualNeutralPatchLinearRgb.map(
      (v) => input.callerChosenNeutralReferenceValue / v,
    ),
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualNeutralPatchLinearRgb: [1, 2, 4],
    callerChosenNeutralReferenceValue: 2,
  },
  output: { result: { conditionalRgbMultiplicativeGains: [2, 1, 0.5] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "film/white-balance-gain",
  title: "White Balance Gain Calculator",
  description:
    "Actual neutral patch inverse LINEARRGB channel gains relative independent reference, same exposure/black level corrected. Not gammaRGB, color-temperature estimation or sensor-colorimetry/white balance pipeline.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          conditionalRgbMultiplicativeGains: {
            type: "array",
            items: { type: "number" },
          },
        },
        required: ["conditionalRgbMultiplicativeGains"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
