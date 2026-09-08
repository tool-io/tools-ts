import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredSignedVerticalIncisorOverlapMm: number;
  readonly independentlyMeasuredMatchedLowerIncisorClinicalCrownHeightMm: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredSignedVerticalIncisorOverlapMm",
    label: "Independently measured signed vertical incisor overlap mm",
    kind: "number",
  },
  {
    id: "independentlyMeasuredMatchedLowerIncisorClinicalCrownHeightMm",
    label:
      "Independently measured matched lower incisor clinical crown height mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(
    input.independentlyMeasuredMatchedLowerIncisorClinicalCrownHeightMm,
    "crownheight",
  );
  return {
    signedObservedOverbitePercent:
      (100 * input.independentlyMeasuredSignedVerticalIncisorOverlapMm) /
      input.independentlyMeasuredMatchedLowerIncisorClinicalCrownHeightMm,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredSignedVerticalIncisorOverlapMm: 2,
    independentlyMeasuredMatchedLowerIncisorClinicalCrownHeightMm: 8,
  },
  output: { result: { signedObservedOverbitePercent: 25 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dentistry/overbite-depth-percent",
  title: "Overbite Depth Percent Calculator",
  description:
    "Signed vertical incisal overlap as percentage of actual matched LOWERincisor clinical crown height; open bite negative, not select a universal normal range or treatment.",
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
