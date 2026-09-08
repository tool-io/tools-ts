import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  sum,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredMandibularToothWidthsMm: readonly number[];
  readonly independentlyMatchedMaxillaryToothWidthsMm: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredMandibularToothWidthsMm",
    label: "Independently measured mandibular tooth widths mm",
    kind: "numberList",
  },
  {
    id: "independentlyMatchedMaxillaryToothWidthsMm",
    label: "Independently matched maxillary tooth widths mm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    input.independentlyMeasuredMandibularToothWidthsMm.length !== 12 ||
    input.independentlyMatchedMaxillaryToothWidthsMm.length !== 12
  )
    simpleError("teeth", "Exactly declared matched Boltonteeth per arch.");
  [
    input.independentlyMeasuredMandibularToothWidthsMm,
    input.independentlyMatchedMaxillaryToothWidthsMm,
  ].forEach((v) => v.forEach((x) => positive(x, "width")));
  return {
    observedBoltonRatioPercent:
      (100 * sum(input.independentlyMeasuredMandibularToothWidthsMm)) /
      positive(
        sum(input.independentlyMatchedMaxillaryToothWidthsMm),
        "maxillary",
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredMandibularToothWidthsMm: [
      5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
    ],
    independentlyMatchedMaxillaryToothWidthsMm: [
      6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
    ],
  },
  output: { result: { observedBoltonRatioPercent: 83.33333333333333 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dentistry/bolton-analysis-overall-ratio",
  title: "Bolton Overall Ratio Calculator",
  description:
    "Actual Boltonoverall twelve-teeth-per-arch lower-width sum/upper-width sum percent. Tooth inclusion and contact widths independently assessed; not a universal ideal-ratio norm or treatment plan.",
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
