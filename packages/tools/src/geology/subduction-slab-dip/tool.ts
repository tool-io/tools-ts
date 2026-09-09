import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualSlabDepthDifferenceKm: number;
  readonly actualHorizontalSlabProjectionKm: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualSlabDepthDifferenceKm",
    label: "Actual slab depth difference km",
    kind: "number",
  },
  {
    id: "actualHorizontalSlabProjectionKm",
    label: "Actual horizontal slab projection km",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  nonnegative(input.actualSlabDepthDifferenceKm, "depth");
  positive(input.actualHorizontalSlabProjectionKm, "horizontal");
  return {
    observedSlabDipDegrees:
      (180 / Math.PI) *
      Math.atan2(
        input.actualSlabDepthDifferenceKm,
        input.actualHorizontalSlabProjectionKm,
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualSlabDepthDifferenceKm: 3,
    actualHorizontalSlabProjectionKm: 4,
  },
  output: { result: { observedSlabDipDegrees: 36.86989764584402 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "geology/subduction-slab-dip",
  title: "Geology Subduction Slab Dip Calculator",
  description:
    "Actual slab segment depth/horizontal projection dip, not total subduction geometry or infer earthquakes from angle.",
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
