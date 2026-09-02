import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  integer,
  aligned,
  catalogIndex,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly callerLegacyTenorIds: readonly string[];
  readonly callerVerifiedSpreadAdjustmentBps: readonly number[];
  readonly queryLegacyTenorId: string;
  readonly observedReplacementSofrBps: number;
  readonly observedLegacyLiborBps: number;
}>;
export type Output = Readonly<{
  readonly callerAdjustedReplacementBps: number;
  readonly signedLegacyMinusAdjustedBasisBps: number;
}>;
const inputFields = [
  {
    id: "callerLegacyTenorIds",
    label: "Caller legacy tenor ids",
    kind: "stringList",
  },
  {
    id: "callerVerifiedSpreadAdjustmentBps",
    label: "Caller verified spread adjustment bps",
    kind: "numberList",
  },
  { id: "queryLegacyTenorId", label: "Query legacy tenor id", kind: "string" },
  {
    id: "observedReplacementSofrBps",
    label: "Observed replacement sofr bps",
    kind: "number",
  },
  {
    id: "observedLegacyLiborBps",
    label: "Observed legacy libor bps",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(
    input.callerLegacyTenorIds,
    input.callerVerifiedSpreadAdjustmentBps,
    "tenors",
  );
  input.callerVerifiedSpreadAdjustmentBps.forEach((v) => integer(v, "spread"));
  integer(input.observedReplacementSofrBps, "SOFR");
  integer(input.observedLegacyLiborBps, "LIBOR");
  const i = catalogIndex(input.callerLegacyTenorIds, input.queryLegacyTenorId),
    adjusted = integer(
      input.observedReplacementSofrBps +
        input.callerVerifiedSpreadAdjustmentBps[i],
      "adjusted",
    );
  return {
    callerAdjustedReplacementBps: adjusted,
    signedLegacyMinusAdjustedBasisBps: integer(
      input.observedLegacyLiborBps - adjusted,
      "basis",
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerLegacyTenorIds: ["1m", "3m"],
  callerVerifiedSpreadAdjustmentBps: [10, 20],
  queryLegacyTenorId: "3m",
  observedReplacementSofrBps: 500,
  observedLegacyLiborBps: 550,
} satisfies Input;
export const exampleOutput = {
  callerAdjustedReplacementBps: 520,
  signedLegacyMinusAdjustedBasisBps: 30,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/sofr-libor-transition-basis-lookup",
  title: "SOFR LIBOR Transition Basis Lookup",
  description:
    "Reconcile actual SOFR/LIBOR observations with caller verified tenor-specific transition spread, no current rate feed, frozen universal adjustment or contract amendment. Caller independently verifies edition, jurisdiction, applicability and one currency; screening does not establish legal compliance, coverage or bank approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerAdjustedReplacementBps",
      label: "Caller adjusted replacement bps",
      kind: "number",
    },
    {
      id: "signedLegacyMinusAdjustedBasisBps",
      label: "Signed legacy minus adjusted basis bps",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      callerLegacyTenorIds: value.callerLegacyTenorIds as readonly string[],
      callerVerifiedSpreadAdjustmentBps:
        value.callerVerifiedSpreadAdjustmentBps as readonly number[],
      queryLegacyTenorId: value.queryLegacyTenorId as string,
      observedReplacementSofrBps: value.observedReplacementSofrBps as number,
      observedLegacyLiborBps: value.observedLegacyLiborBps as number,
    }),
});
export const run = tool.execute;
export default tool;
