import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly independentlyReconstructedVerticalDropMeters: number;
  readonly matchedHorizontalRunMeters: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyReconstructedVerticalDropMeters",
    label: "Independently reconstructed vertical drop meters",
    kind: "number",
  },
  {
    id: "matchedHorizontalRunMeters",
    label: "Matched horizontal run meters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  positive(input.matchedHorizontalRunMeters, "run");
  return {
    conditionalPaleoslopeDegrees:
      (180 / Math.PI) *
      Math.atan2(
        input.independentlyReconstructedVerticalDropMeters,
        input.matchedHorizontalRunMeters,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyReconstructedVerticalDropMeters: 2,
    matchedHorizontalRunMeters: 4,
  },
  output: { result: { conditionalPaleoslopeDegrees: 26.56505117707799 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/paleoslope",
  title: "Geology Paleoslope Calculator",
  description:
    "Paleoslope angle from independently reconstructed drop and horizontal run. Actual reconstruction, compaction/tectonic correction and transport model external; not infer ancient slope from grain size alone.",
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
