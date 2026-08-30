import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, count, totalCount } from "../shared.js";
export type Input = Readonly<{
  readonly objectLeafCounts: readonly number[];
  readonly callerInterleaveBothOuterFaces: boolean;
  readonly existingUsableTissueSheetCount: number;
}>;
export type Output = Readonly<{
  readonly requiredTissueSheetsByObject: readonly number[];
  readonly totalRequiredTissueSheets: number;
  readonly additionalTissueSheetDeficit: number;
}>;
const inputFields = [
  { id: "objectLeafCounts", label: "Object leaf counts", kind: "numberList" },
  {
    id: "callerInterleaveBothOuterFaces",
    label: "Caller interleave both outer faces",
    kind: "boolean",
  },
  {
    id: "existingUsableTissueSheetCount",
    label: "Existing usable tissue sheet count",
    kind: "integer",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.objectLeafCounts.forEach((v) => count(v, "objectLeafCounts"));
  count(input.existingUsableTissueSheetCount, "existingUsableTissueSheetCount");
  const n = input.objectLeafCounts.map((v) =>
      v === 0
        ? 0
        : count(
            v - 1 + (input.callerInterleaveBothOuterFaces ? 2 : 0),
            "sheets",
          ),
    ),
    total = totalCount(n, "sheets");
  return {
    requiredTissueSheetsByObject: n,
    totalRequiredTissueSheets: total,
    additionalTissueSheetDeficit: Math.max(
      0,
      total - input.existingUsableTissueSheetCount,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  objectLeafCounts: [3, 5],
  callerInterleaveBothOuterFaces: true,
  existingUsableTissueSheetCount: 5,
} satisfies Input;
export const exampleOutput = {
  requiredTissueSheetsByObject: [4, 6],
  totalRequiredTissueSheets: 10,
  additionalTissueSheetDeficit: 5,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/interleaving-sheet-count-calculator",
  title: "Interleaving Tissue Sheet Count per Object Calculator",
  description:
    "Count between-leaf interleaving with explicit optional outer faces and existing usable stock; zero-leaf objects require none, no material compatibility or handling advice.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredTissueSheetsByObject",
      label: "Required tissue sheets by object",
      kind: "numberList",
    },
    {
      id: "totalRequiredTissueSheets",
      label: "Total required tissue sheets",
      kind: "number",
    },
    {
      id: "additionalTissueSheetDeficit",
      label: "Additional tissue sheet deficit",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      objectLeafCounts: value.objectLeafCounts as readonly number[],
      callerInterleaveBothOuterFaces:
        value.callerInterleaveBothOuterFaces as boolean,
      existingUsableTissueSheetCount:
        value.existingUsableTissueSheetCount as number,
    }),
});
export const run = tool.execute;
export default tool;
