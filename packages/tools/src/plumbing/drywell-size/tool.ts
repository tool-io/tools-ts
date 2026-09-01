import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  fraction,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly observedDesignDrywellRunoffLiters: number;
  readonly callerDuringEventInfiltrationCreditLiters: number;
  readonly callerVerifiedAggregateVoidFraction: number;
  readonly observedUsableDrywellBulkVolumeLiters: number;
}>;
export type Output = Readonly<{
  readonly requiredDrywellVoidStorageLiters: number;
  readonly requiredDrywellBulkLiters: number;
  readonly signedInstalledDrywellBulkMarginLiters: number;
}>;
const inputFields = [
  {
    id: "observedDesignDrywellRunoffLiters",
    label: "Observed design drywell runoff liters",
    kind: "number",
  },
  {
    id: "callerDuringEventInfiltrationCreditLiters",
    label: "Caller during event infiltration credit liters",
    kind: "number",
  },
  {
    id: "callerVerifiedAggregateVoidFraction",
    label: "Caller verified aggregate void fraction",
    kind: "number",
  },
  {
    id: "observedUsableDrywellBulkVolumeLiters",
    label: "Observed usable drywell bulk volume liters",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(
    input.callerVerifiedAggregateVoidFraction,
    "callerVerifiedAggregateVoidFraction",
  );
  nonnegative(
    input.observedDesignDrywellRunoffLiters,
    "observedDesignDrywellRunoffLiters",
  );
  nonnegative(
    input.callerDuringEventInfiltrationCreditLiters,
    "callerDuringEventInfiltrationCreditLiters",
  );
  nonnegative(
    input.observedUsableDrywellBulkVolumeLiters,
    "observedUsableDrywellBulkVolumeLiters",
  );
  fraction(
    input.callerVerifiedAggregateVoidFraction,
    "callerVerifiedAggregateVoidFraction",
  );
  const voids = Math.max(
      0,
      input.observedDesignDrywellRunoffLiters -
        input.callerDuringEventInfiltrationCreditLiters,
    ),
    bulk = voids / input.callerVerifiedAggregateVoidFraction;
  return {
    requiredDrywellVoidStorageLiters: voids,
    requiredDrywellBulkLiters: bulk,
    signedInstalledDrywellBulkMarginLiters:
      input.observedUsableDrywellBulkVolumeLiters - bulk,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedDesignDrywellRunoffLiters: 1000,
  callerDuringEventInfiltrationCreditLiters: 200,
  callerVerifiedAggregateVoidFraction: 0.4,
  observedUsableDrywellBulkVolumeLiters: 1500,
} satisfies Input;
export const exampleOutput = {
  requiredDrywellVoidStorageLiters: 800,
  requiredDrywellBulkLiters: 2000,
  signedInstalledDrywellBulkMarginLiters: -500,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "plumbing/drywell-size",
  title: "Plumbing Drywell Size Calculator",
  description:
    "Budget actual event runoff less independently justified contemporaneous infiltration against verified aggregate void fraction/installed volume; no assumed soil drainage, aquifer protection or flood design approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "requiredDrywellVoidStorageLiters",
      label: "Required drywell void storage liters",
      kind: "number",
    },
    {
      id: "requiredDrywellBulkLiters",
      label: "Required drywell bulk liters",
      kind: "number",
    },
    {
      id: "signedInstalledDrywellBulkMarginLiters",
      label: "Signed installed drywell bulk margin liters",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedDesignDrywellRunoffLiters:
        value.observedDesignDrywellRunoffLiters as number,
      callerDuringEventInfiltrationCreditLiters:
        value.callerDuringEventInfiltrationCreditLiters as number,
      callerVerifiedAggregateVoidFraction:
        value.callerVerifiedAggregateVoidFraction as number,
      observedUsableDrywellBulkVolumeLiters:
        value.observedUsableDrywellBulkVolumeLiters as number,
    }),
});
export const run = tool.execute;
export default tool;
