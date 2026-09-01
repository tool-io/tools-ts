import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  binary,
  unique,
  safeText,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly propIds: readonly string[];
  readonly expectedTableSlots: readonly string[];
  readonly observedTableSlots: readonly string[];
  readonly placementEvidenceFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly correctlyPlacedPropCount: number;
  readonly misplacedPropIds: readonly string[];
  readonly unobservedPropIds: readonly string[];
}>;
const inputFields = [
  { id: "propIds", label: "Prop ids", kind: "stringList" },
  {
    id: "expectedTableSlots",
    label: "Expected table slots",
    kind: "stringList",
  },
  {
    id: "observedTableSlots",
    label: "Observed table slots",
    kind: "stringList",
  },
  {
    id: "placementEvidenceFlags",
    label: "Placement evidence flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  binary(input.placementEvidenceFlags, "placementEvidenceFlags");
  aligned(input.propIds, input.expectedTableSlots, "propIds");
  aligned(input.propIds, input.observedTableSlots, "propIds");
  aligned(input.propIds, input.placementEvidenceFlags, "propIds");
  unique(input.propIds, "props");
  input.expectedTableSlots.forEach((v) => safeText(v, "expectedSlot"));
  const wrong = input.propIds.filter(
      (_, i) =>
        input.placementEvidenceFlags[i] &&
        input.expectedTableSlots[i] !== input.observedTableSlots[i],
    ),
    unknown = input.propIds.filter((_, i) => !input.placementEvidenceFlags[i]);
  return {
    correctlyPlacedPropCount:
      input.propIds.length - wrong.length - unknown.length,
    misplacedPropIds: wrong,
    unobservedPropIds: unknown,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  propIds: ["a", "b", "c"],
  expectedTableSlots: ["1", "2", "3"],
  observedTableSlots: ["1", "3", ""],
  placementEvidenceFlags: [1, 1, 0],
} satisfies Input;
export const exampleOutput = {
  correctlyPlacedPropCount: 1,
  misplacedPropIds: ["b"],
  unobservedPropIds: ["c"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/props-table-setup-tracking-checklist-count",
  title: "Props Table Setup Tracking Checklist Count Tool",
  description:
    "Reconcile actual props-table placement evidence against assigned slot labels; unlike ID checklist coverage checks actual positions and missing observations, not prop safety/condition or ownership.",
  inputs: inputFields,
  outputs: [
    {
      id: "correctlyPlacedPropCount",
      label: "Correctly placed prop count",
      kind: "number",
    },
    { id: "misplacedPropIds", label: "Misplaced prop ids", kind: "stringList" },
    {
      id: "unobservedPropIds",
      label: "Unobserved prop ids",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      propIds: value.propIds as readonly string[],
      expectedTableSlots: value.expectedTableSlots as readonly string[],
      observedTableSlots: value.observedTableSlots as readonly string[],
      placementEvidenceFlags: value.placementEvidenceFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
