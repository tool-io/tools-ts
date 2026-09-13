import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
  nonnegative,
} from "../batch50-shared.js";
export type Input = Readonly<{
  readonly actualIndependentlyComputedGamutIntersectionArea: number;
  readonly callerMatchedReferenceGamutArea: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualIndependentlyComputedGamutIntersectionArea",
    label: "Actual independently computed gamut intersection area",
    kind: "number",
  },
  {
    id: "callerMatchedReferenceGamutArea",
    label: "Caller matched reference gamut area",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(
    input.actualIndependentlyComputedGamutIntersectionArea,
    "actualIndependentlyComputedGamutIntersectionArea",
  );
  positive(
    input.callerMatchedReferenceGamutArea,
    "callerMatchedReferenceGamutArea",
  );
  if (
    input.actualIndependentlyComputedGamutIntersectionArea >
    input.callerMatchedReferenceGamutArea
  )
    simpleError("area", "Actualintersection≤reference.");
  return {
    value:
      (100 * input.actualIndependentlyComputedGamutIntersectionArea) /
      input.callerMatchedReferenceGamutArea,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualIndependentlyComputedGamutIntersectionArea: 2,
    callerMatchedReferenceGamutArea: 4,
  },
  output: { result: { value: 50 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vr/display-color-gamut-coverage-vr",
  title: "Display Color Gamut Coverage VR Calculator",
  description:
    "Actualprecomputedpolygon INTERSECTION area/reference area, not entire display gamut area/reference falsely called coverage. Samechromaticityplane/intersection externally independently resolved.",
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
