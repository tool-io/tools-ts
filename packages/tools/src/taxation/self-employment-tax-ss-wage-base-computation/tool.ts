import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, money, rateMinor } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerAdjustedNetSelfEmploymentMinor: number;
  readonly otherSubjectWagesMinor: number;
  readonly callerSsWageBaseMinor: number;
  readonly callerSsBasisPoints: number;
  readonly callerMedicareBasisPoints: number;
}>;
export type Output = Readonly<{
  readonly ssSubjectSelfEmploymentMinor: number;
  readonly conditionalSsTaxMinor: number;
  readonly conditionalMedicareTaxMinor: number;
}>;
const inputFields = [
  {
    id: "callerAdjustedNetSelfEmploymentMinor",
    label: "Caller adjusted net self employment minor",
    kind: "number",
  },
  {
    id: "otherSubjectWagesMinor",
    label: "Other subject wages minor",
    kind: "number",
  },
  {
    id: "callerSsWageBaseMinor",
    label: "Caller ss wage base minor",
    kind: "number",
  },
  {
    id: "callerSsBasisPoints",
    label: "Caller ss basis points",
    kind: "number",
  },
  {
    id: "callerMedicareBasisPoints",
    label: "Caller medicare basis points",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  money(
    input.callerAdjustedNetSelfEmploymentMinor,
    "callerAdjustedNetSelfEmploymentMinor",
  );
  money(input.otherSubjectWagesMinor, "otherSubjectWagesMinor");
  money(input.callerSsWageBaseMinor, "callerSsWageBaseMinor");
  const s = Math.min(
    input.callerAdjustedNetSelfEmploymentMinor,
    Math.max(0, input.callerSsWageBaseMinor - input.otherSubjectWagesMinor),
  );
  return {
    ssSubjectSelfEmploymentMinor: s,
    conditionalSsTaxMinor: rateMinor(s, input.callerSsBasisPoints),
    conditionalMedicareTaxMinor: rateMinor(
      input.callerAdjustedNetSelfEmploymentMinor,
      input.callerMedicareBasisPoints,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerAdjustedNetSelfEmploymentMinor: 100,
  otherSubjectWagesMinor: 80,
  callerSsWageBaseMinor: 150,
  callerSsBasisPoints: 1240,
  callerMedicareBasisPoints: 290,
} satisfies Input;
export const exampleOutput = {
  ssSubjectSelfEmploymentMinor: 70,
  conditionalSsTaxMinor: 9,
  conditionalMedicareTaxMinor: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/self-employment-tax-ss-wage-base-computation",
  title: "Self Employment Tax SS Wage Base Computation Tool",
  description:
    "Already adjusted eligible SE earnings with shared SS wage-base reduction by other wages; Medicare uncapped separately, no earnings adjustment/additional Medicare/exemption inferred. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
  inputs: inputFields,
  outputs: [
    {
      id: "ssSubjectSelfEmploymentMinor",
      label: "Ss subject self employment minor",
      kind: "number",
    },
    {
      id: "conditionalSsTaxMinor",
      label: "Conditional ss tax minor",
      kind: "number",
    },
    {
      id: "conditionalMedicareTaxMinor",
      label: "Conditional medicare tax minor",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerAdjustedNetSelfEmploymentMinor:
        value.callerAdjustedNetSelfEmploymentMinor as number,
      otherSubjectWagesMinor: value.otherSubjectWagesMinor as number,
      callerSsWageBaseMinor: value.callerSsWageBaseMinor as number,
      callerSsBasisPoints: value.callerSsBasisPoints as number,
      callerMedicareBasisPoints: value.callerMedicareBasisPoints as number,
    }),
});
export const run = tool.execute;
export default tool;
