import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  binary,
  unique,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerDutyIds: readonly string[];
  readonly callerOwnOccupationRequiredDutyFlags: readonly number[];
  readonly callerAnyOccupationRequiredDutyFlags: readonly number[];
  readonly observedDutyAbilityFlags: readonly number[];
  readonly dutyAbilityEvidenceFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerOwnOccUnmetDutyIds: readonly string[];
  readonly callerAnyOccUnmetDutyIds: readonly string[];
  readonly unknownDutyAbilityIds: readonly string[];
}>;
const inputFields = [
  { id: "callerDutyIds", label: "Caller duty ids", kind: "stringList" },
  {
    id: "callerOwnOccupationRequiredDutyFlags",
    label: "Caller own occupation required duty flags",
    kind: "numberList",
  },
  {
    id: "callerAnyOccupationRequiredDutyFlags",
    label: "Caller any occupation required duty flags",
    kind: "numberList",
  },
  {
    id: "observedDutyAbilityFlags",
    label: "Observed duty ability flags",
    kind: "numberList",
  },
  {
    id: "dutyAbilityEvidenceFlags",
    label: "Duty ability evidence flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.callerDutyIds, "duties");
  for (const flags of [
    input.callerOwnOccupationRequiredDutyFlags,
    input.callerAnyOccupationRequiredDutyFlags,
    input.observedDutyAbilityFlags,
    input.dutyAbilityEvidenceFlags,
  ]) {
    aligned(input.callerDutyIds, flags, "duties");
    binary(flags, "duties");
  }
  return {
    callerOwnOccUnmetDutyIds: input.callerDutyIds.filter(
      (_, i) =>
        input.callerOwnOccupationRequiredDutyFlags[i] &&
        input.dutyAbilityEvidenceFlags[i] &&
        !input.observedDutyAbilityFlags[i],
    ),
    callerAnyOccUnmetDutyIds: input.callerDutyIds.filter(
      (_, i) =>
        input.callerAnyOccupationRequiredDutyFlags[i] &&
        input.dutyAbilityEvidenceFlags[i] &&
        !input.observedDutyAbilityFlags[i],
    ),
    unknownDutyAbilityIds: input.callerDutyIds.filter(
      (_, i) => !input.dutyAbilityEvidenceFlags[i],
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerDutyIds: ["a", "b"],
  callerOwnOccupationRequiredDutyFlags: [1, 0],
  callerAnyOccupationRequiredDutyFlags: [1, 1],
  observedDutyAbilityFlags: [1, 0],
  dutyAbilityEvidenceFlags: [1, 1],
} satisfies Input;
export const exampleOutput = {
  callerOwnOccUnmetDutyIds: [],
  callerAnyOccUnmetDutyIds: ["b"],
  unknownDutyAbilityIds: [],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/own-occ-vs-any-occ-definition-lookup",
  title: "Own Occ vs Any Occ Definition Lookup",
  description:
    "Compare actual duty-ability annotations against caller own/any-occupation required-duty maps with explicit unknowns; no inferred income/vocational skills or disability diagnosis/benefit eligibility.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerOwnOccUnmetDutyIds",
      label: "Caller own occ unmet duty ids",
      kind: "stringList",
    },
    {
      id: "callerAnyOccUnmetDutyIds",
      label: "Caller any occ unmet duty ids",
      kind: "stringList",
    },
    {
      id: "unknownDutyAbilityIds",
      label: "Unknown duty ability ids",
      kind: "stringList",
    },
  ],
  calculate: (value) =>
    calculate({
      callerDutyIds: value.callerDutyIds as readonly string[],
      callerOwnOccupationRequiredDutyFlags:
        value.callerOwnOccupationRequiredDutyFlags as readonly number[],
      callerAnyOccupationRequiredDutyFlags:
        value.callerAnyOccupationRequiredDutyFlags as readonly number[],
      observedDutyAbilityFlags:
        value.observedDutyAbilityFlags as readonly number[],
      dutyAbilityEvidenceFlags:
        value.dutyAbilityEvidenceFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
