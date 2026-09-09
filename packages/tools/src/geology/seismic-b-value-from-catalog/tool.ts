import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  mean,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualCompleteCatalogMagnitudes: readonly number[];
  readonly callerIndependentlyEstablishedCompletenessMagnitude: number;
  readonly actualMagnitudeBinWidth: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualCompleteCatalogMagnitudes",
    label: "Actual complete catalog magnitudes",
    kind: "numberList",
  },
  {
    id: "callerIndependentlyEstablishedCompletenessMagnitude",
    label: "Caller independently established completeness magnitude",
    kind: "number",
  },
  {
    id: "actualMagnitudeBinWidth",
    label: "Actual magnitude bin width",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.actualMagnitudeBinWidth, "binwidth");
  if (
    !input.actualCompleteCatalogMagnitudes.length ||
    input.actualCompleteCatalogMagnitudes.some(
      (v) => v < input.callerIndependentlyEstablishedCompletenessMagnitude,
    )
  )
    simpleError(
      "catalog",
      "Actual nonempty independently complete catalog≥Mc.",
    );
  return {
    conditionalAkiBEstimate:
      Math.LOG10E /
      positive(
        mean(input.actualCompleteCatalogMagnitudes) -
          (input.callerIndependentlyEstablishedCompletenessMagnitude -
            input.actualMagnitudeBinWidth / 2),
        "mean-above-completeness",
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualCompleteCatalogMagnitudes: [2, 3, 4],
    callerIndependentlyEstablishedCompletenessMagnitude: 2,
    actualMagnitudeBinWidth: 0.2,
  },
  output: { result: { conditionalAkiBEstimate: 0.39481316536659256 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/seismic-b-value-from-catalog",
  title: "Geology Seismic B Value From Catalog Calculator",
  description:
    "Declared discrete-bin AkiMLEb=log10(e)/(meanM\u2212(Mc\u2212\u0394M/2)), complete actual catalog above independently verified Mc. Declustering, completeness, bin origin and uncertainty external; not fault recurrence forecast.",
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
