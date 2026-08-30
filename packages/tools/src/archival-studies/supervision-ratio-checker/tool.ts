import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  count,
  aligned,
  safeCeil,
} from "../shared.js";
export type Input = Readonly<{
  readonly researchersPresentByInterval: readonly number[];
  readonly qualifiedStaffPresentByInterval: readonly number[];
  readonly callerMaximumResearchersPerStaff: number;
  readonly representedHours: readonly number[];
}>;
export type Output = Readonly<{
  readonly requiredWholeStaffByInterval: readonly number[];
  readonly staffingDeficits: readonly number[];
  readonly underPolicyStaffedHours: number;
}>;
const inputFields = [
  {
    id: "researchersPresentByInterval",
    label: "Researchers present by interval",
    kind: "numberList",
  },
  {
    id: "qualifiedStaffPresentByInterval",
    label: "Qualified staff present by interval",
    kind: "numberList",
  },
  {
    id: "callerMaximumResearchersPerStaff",
    label: "Caller maximum researchers per staff",
    kind: "number",
  },
  { id: "representedHours", label: "Represented hours", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerMaximumResearchersPerStaff,
    "callerMaximumResearchersPerStaff",
  );
  input.representedHours.forEach((v) => nonnegative(v, "representedHours"));
  input.researchersPresentByInterval.forEach((v) =>
    count(v, "researchersPresentByInterval"),
  );
  input.qualifiedStaffPresentByInterval.forEach((v) =>
    count(v, "qualifiedStaffPresentByInterval"),
  );
  aligned(
    input.researchersPresentByInterval,
    input.qualifiedStaffPresentByInterval,
    "researchersPresentByInterval",
  );
  aligned(
    input.researchersPresentByInterval,
    input.representedHours,
    "researchersPresentByInterval",
  );
  const n = input.researchersPresentByInterval.map((v) =>
      safeCeil(v / input.callerMaximumResearchersPerStaff, "staff"),
    ),
    d = n.map((v, i) =>
      Math.max(0, v - input.qualifiedStaffPresentByInterval[i]),
    );
  return {
    requiredWholeStaffByInterval: n,
    staffingDeficits: d,
    underPolicyStaffedHours: input.representedHours.reduce(
      (s, v, i) => s + (d[i] > 0 ? v : 0),
      0,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  researchersPresentByInterval: [5, 10, 4],
  qualifiedStaffPresentByInterval: [1, 1, 0],
  callerMaximumResearchersPerStaff: 6,
  representedHours: [1, 2, 1],
} satisfies Input;
export const exampleOutput = {
  requiredWholeStaffByInterval: [1, 2, 1],
  staffingDeficits: [0, 1, 1],
  underPolicyStaffedHours: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archival-studies/supervision-ratio-checker",
  title: "Reading Room Supervision Ratio Staff-to-Researchers Checker",
  description:
    "Audit simultaneous reading-room headcounts against caller supervision ratio by actual interval exposure, retaining understaffing without dividing by zero staff; no safe staffing/legal rule.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredWholeStaffByInterval",
      label: "Required whole staff by interval",
      kind: "numberList",
    },
    { id: "staffingDeficits", label: "Staffing deficits", kind: "numberList" },
    {
      id: "underPolicyStaffedHours",
      label: "Under policy staffed hours",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      researchersPresentByInterval:
        value.researchersPresentByInterval as readonly number[],
      qualifiedStaffPresentByInterval:
        value.qualifiedStaffPresentByInterval as readonly number[],
      callerMaximumResearchersPerStaff:
        value.callerMaximumResearchersPerStaff as number,
      representedHours: value.representedHours as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
