import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, inventory } from "../batch48-shared.js";
export type Input = Readonly<{
  readonly actualPhysicalSegmentIds: readonly string[];
  readonly actualSegmentLengthsMeters: readonly number[];
  readonly itemEvidenceKnownFlags: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualPhysicalSegmentIds",
    label: "Actual physical segment ids",
    kind: "stringList",
  },
  {
    id: "actualSegmentLengthsMeters",
    label: "Actual segment lengths meters",
    kind: "numberList",
  },
  {
    id: "itemEvidenceKnownFlags",
    label: "Item evidence known flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const r = inventory(
    input.actualPhysicalSegmentIds,
    input.actualSegmentLengthsMeters,
    input.itemEvidenceKnownFlags,
  );
  return {
    knownTotal: r.knownTotal,
    knownIds: r.knownIds,
    unknownIds: r.unknownIds,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    actualPhysicalSegmentIds: ["a", "b"],
    actualSegmentLengthsMeters: [2, 3],
    itemEvidenceKnownFlags: [1, 0],
  },
  output: { result: { knownTotal: 2, knownIds: ["a"], unknownIds: ["b"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "speleology/total-length-aggregator",
  title: "Cave System Total Length Aggregator",
  description:
    "Sum unique independently mapped physical passage segments, unknowns retained; duplicate IDsrejected, physical nonoverlap/completeness externally verified. No total-length accuracy or gear operational safety.",
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
