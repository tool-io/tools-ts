import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerCouplingAdjustment: number;
  readonly independentGroupBPostureScore: number;
  readonly staticHoldOverMinute: boolean;
  readonly repetitionOverFourPerMinute: boolean;
  readonly rapidLargePostureChanges: boolean;
  readonly independentTableCScore: number;
}>;
export type Output = Readonly<{
  readonly couplingAdjustment: number;
  readonly couplingAdjustedGroupBScore: number;
  readonly activityAdjustment: number;
  readonly activityAdjustedScore: number;
}>;
const inputFields = [
  {
    id: "independentGroupBPostureScore",
    label: "Independent Group B posture score",
    kind: "number",
  },
  {
    id: "callerCouplingAdjustment",
    label: "Caller coupling adjustment",
    kind: "number",
  },
  {
    id: "staticHoldOverMinute",
    label: "Static hold over minute",
    kind: "boolean",
  },
  {
    id: "repetitionOverFourPerMinute",
    label: "Repetition over four per minute",
    kind: "boolean",
  },
  {
    id: "rapidLargePostureChanges",
    label: "Rapid large posture changes",
    kind: "boolean",
  },
  {
    id: "independentTableCScore",
    label: "Independent table c score",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.callerCouplingAdjustment, "coupling", 0, 3);
  bounded(input.independentGroupBPostureScore, "GroupB", 1, 9);
  bounded(input.independentTableCScore, "TableC", 1, 12);
  const a =
    Number(input.staticHoldOverMinute) +
    Number(input.repetitionOverFourPerMinute) +
    Number(input.rapidLargePostureChanges);
  return {
    couplingAdjustment: input.callerCouplingAdjustment,
    couplingAdjustedGroupBScore:
      input.independentGroupBPostureScore + input.callerCouplingAdjustment,
    activityAdjustment: a,
    activityAdjustedScore: input.independentTableCScore + a,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerCouplingAdjustment: 1,
  independentGroupBPostureScore: 4,
  staticHoldOverMinute: true,
  repetitionOverFourPerMinute: false,
  rapidLargePostureChanges: true,
  independentTableCScore: 5,
} satisfies Input;
export const exampleOutput = {
  couplingAdjustment: 1,
  couplingAdjustedGroupBScore: 5,
  activityAdjustment: 2,
  activityAdjustedScore: 7,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "ergonomics/reba-coupling-adjuster",
  title: "REBA Activity Coupling Adjuster Calculator",
  description:
    "REBA coupling addition to independently scored Group B, and separate activity addition to caller Table C already evaluated with coupling-adjusted B. Coupling is not added a second time to Table C. Caller independently establishes matching protocol, evidence and applicability; not a work-safety determination.",
  inputs: inputFields,
  outputs: [
    {
      id: "couplingAdjustedGroupBScore",
      label: "Coupling-adjusted Group B score",
      kind: "number",
    },
    { id: "couplingAdjustment", label: "Coupling adjustment", kind: "number" },
    { id: "activityAdjustment", label: "Activity adjustment", kind: "number" },
    {
      id: "activityAdjustedScore",
      label: "Activity adjusted score",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerCouplingAdjustment: value.callerCouplingAdjustment as number,
      independentGroupBPostureScore:
        value.independentGroupBPostureScore as number,
      staticHoldOverMinute: value.staticHoldOverMinute as boolean,
      repetitionOverFourPerMinute: value.repetitionOverFourPerMinute as boolean,
      rapidLargePostureChanges: value.rapidLargePostureChanges as boolean,
      independentTableCScore: value.independentTableCScore as number,
    }),
});
export const run = tool.execute;
export default tool;
