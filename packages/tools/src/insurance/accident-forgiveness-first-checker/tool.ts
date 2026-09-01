import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, bounded } from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedPriorForgivenAccidentCount: number;
  readonly observedCurrentAccidentCount: number;
  readonly callerMaximumLifetimeForgivenCount: number;
  readonly callerForgivenessEndorsementVerified: boolean;
}>;
export type Output = Readonly<{
  readonly callerRemainingForgivenessSlots: number;
  readonly currentAccidentsWithinCallerForgivenessBudget: boolean;
}>;
const inputFields = [
  {
    id: "observedPriorForgivenAccidentCount",
    label: "Observed prior forgiven accident count",
    kind: "number",
  },
  {
    id: "observedCurrentAccidentCount",
    label: "Observed current accident count",
    kind: "number",
  },
  {
    id: "callerMaximumLifetimeForgivenCount",
    label: "Caller maximum lifetime forgiven count",
    kind: "number",
  },
  {
    id: "callerForgivenessEndorsementVerified",
    label: "Caller forgiveness endorsement verified",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  bounded(input.observedPriorForgivenAccidentCount, "prior", 0, 1000);
  bounded(input.observedCurrentAccidentCount, "current", 0, 1000);
  bounded(input.callerMaximumLifetimeForgivenCount, "maximum", 0, 1000);
  const slots = input.callerForgivenessEndorsementVerified
    ? Math.max(
        0,
        input.callerMaximumLifetimeForgivenCount -
          input.observedPriorForgivenAccidentCount,
      )
    : 0;
  return {
    callerRemainingForgivenessSlots: slots,
    currentAccidentsWithinCallerForgivenessBudget:
      input.observedCurrentAccidentCount <= slots,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedPriorForgivenAccidentCount: 0,
  observedCurrentAccidentCount: 1,
  callerMaximumLifetimeForgivenCount: 1,
  callerForgivenessEndorsementVerified: true,
} satisfies Input;
export const exampleOutput = {
  callerRemainingForgivenessSlots: 1,
  currentAccidentsWithinCallerForgivenessBudget: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/accident-forgiveness-first-checker",
  title: "Accident Forgiveness First Checker",
  description:
    "Audit actual first/current accident forgiveness inventory against verified endorsement/lifetime slot policy; not automatic claim coverage, fault determination or protection guarantee.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerRemainingForgivenessSlots",
      label: "Caller remaining forgiveness slots",
      kind: "number",
    },
    {
      id: "currentAccidentsWithinCallerForgivenessBudget",
      label: "Current accidents within caller forgiveness budget",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      observedPriorForgivenAccidentCount:
        value.observedPriorForgivenAccidentCount as number,
      observedCurrentAccidentCount:
        value.observedCurrentAccidentCount as number,
      callerMaximumLifetimeForgivenCount:
        value.callerMaximumLifetimeForgivenCount as number,
      callerForgivenessEndorsementVerified:
        value.callerForgivenessEndorsementVerified as boolean,
    }),
});
export const run = tool.execute;
export default tool;
