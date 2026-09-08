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
  readonly independentlyMeasuredFourLowerIncisorWidthsMm: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredFourLowerIncisorWidthsMm",
    label: "Independently measured four lower incisor widths mm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (input.independentlyMeasuredFourLowerIncisorWidthsMm.length !== 4)
    simpleError(
      "incisors",
      "Exactly four independently measured lower incisor widths.",
    );
  input.independentlyMeasuredFourLowerIncisorWidthsMm.forEach((v) =>
    positive(v, "width"),
  );
  const s = sum(input.independentlyMeasuredFourLowerIncisorWidthsMm);
  return {
    conditionalMandibularCaninePremolarWidthPerQuadrantMm: s / 2 + 10.5,
    conditionalMaxillaryCaninePremolarWidthPerQuadrantMm: s / 2 + 11,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { independentlyMeasuredFourLowerIncisorWidthsMm: [5, 5, 5, 5] },
  output: {
    result: {
      conditionalMandibularCaninePremolarWidthPerQuadrantMm: 20.5,
      conditionalMaxillaryCaninePremolarWidthPerQuadrantMm: 21,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dentistry/tanaka-johnston-prediction",
  title: "Tanaka-Johnston Prediction Calculator",
  description:
    "Named Tanaka\u2013Johnstonhistorical population regressions:half four-lower-incisor sum+10.5mandibular,+11maxillary per quadrant in mm. Not observed unerupted tooth widths, universal cohort accuracy or orthodontic treatment decision.",
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
