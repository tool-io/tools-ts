import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
  mean,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyCieAdaptedFirstEightTestColorDifferences: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyCieAdaptedFirstEightTestColorDifferences",
    label:
      "Actual independently cie adapted first eight test color differences",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (!input.actualIndependentlyCieAdaptedFirstEightTestColorDifferences.length)
    simpleError(
      "actualIndependentlyCieAdaptedFirstEightTestColorDifferences",
      "Actual nonempty observations.",
    );
  input.actualIndependentlyCieAdaptedFirstEightTestColorDifferences.forEach(
    (v) =>
      nonnegative(
        v,
        "actualIndependentlyCieAdaptedFirstEightTestColorDifferences",
      ),
  );
  if (
    input.actualIndependentlyCieAdaptedFirstEightTestColorDifferences.length !==
    8
  )
    simpleError("CRI", "Actualeightqualifiedtest-colordifferences.");
  return {
    value: mean(
      input.actualIndependentlyCieAdaptedFirstEightTestColorDifferences.map(
        (v) => 100 - 4.6 * v,
      ),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIndependentlyCieAdaptedFirstEightTestColorDifferences: [
      1, 1, 1, 1, 1, 1, 1, 1,
    ],
  },
  output: { result: { value: 95.4 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "film/color-rendering-index-calculation",
  title: "CRI Calculation",
  description:
    "Restricted CIE13.3generalCRI Ra=mean R1\u2026R8from actual already independently chromatic adapted \u0394Ei(1964U*V*W*), Ri=100\u22124.6\u0394Ei. Does not compute spectral integration/adaptationfromSPDs, nofullCRIor light-safety certificate.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
