import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, aligned } from "../batch43-shared.js";

export type Input = Readonly<{
  readonly independentlyAlignedObverseAttributeIds: readonly string[];
  readonly independentlyAlignedReverseAttributeIds: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyAlignedObverseAttributeIds",
    label: "Independently aligned obverse attribute ids",
    kind: "stringList",
  },
  {
    id: "independentlyAlignedReverseAttributeIds",
    label: "Independently aligned reverse attribute ids",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  aligned(
    input.independentlyAlignedObverseAttributeIds,
    input.independentlyAlignedReverseAttributeIds,
    "attributes",
  );
  return {
    differentAttributeIndices:
      input.independentlyAlignedObverseAttributeIds.flatMap((v, i) =>
        v === input.independentlyAlignedReverseAttributeIds[i] ? [] : [i],
      ),
    unchangedAttributeIndices:
      input.independentlyAlignedObverseAttributeIds.flatMap((v, i) =>
        v === input.independentlyAlignedReverseAttributeIds[i] ? [i] : [],
      ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyAlignedObverseAttributeIds: ["seal-a", "red"],
    independentlyAlignedReverseAttributeIds: ["seal-b", "red"],
  },
  output: {
    result: { differentAttributeIndices: [0], unchangedAttributeIndices: [1] },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "vexillology/two-sided-difference-recorder",
  title: "Two-Sided Design Difference Recorder",
  description:
    "Record differences of independently aligned two-sided design attributes after registration; no arbitrary image/text equivalence or orientation inference.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
