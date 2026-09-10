import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  nonnegative,
  sum,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyMeasuredQualifyingQuadrantPocketDepthsCm: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyMeasuredQualifyingQuadrantPocketDepthsCm",
    label: "Independently measured qualifying quadrant pocket depths cm",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (input.independentlyMeasuredQualifyingQuadrantPocketDepthsCm.length !== 4)
    simpleError(
      "quadrants",
      "Exactly four independently qualified quadrant depths.",
    );
  input.independentlyMeasuredQualifyingQuadrantPocketDepthsCm.forEach((v) =>
    nonnegative(v, "pocket"),
  );
  return {
    observedFourQuadrantAfiCm: sum(
      input.independentlyMeasuredQualifyingQuadrantPocketDepthsCm,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyMeasuredQualifyingQuadrantPocketDepthsCm: [2, 3, 4, 5],
  },
  output: { result: { observedFourQuadrantAfiCm: 14 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "pregnancy/amniotic-fluid-index",
  title: "Amniotic Fluid Index Calculator",
  description:
    "Actual clinically independently measured four-quadrant qualifying vertical pocket depths summed as AFI. Does not identify pockets, exclude cord/fetal parts, estimate fluid volume or establish a universal clinical threshold.",
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
