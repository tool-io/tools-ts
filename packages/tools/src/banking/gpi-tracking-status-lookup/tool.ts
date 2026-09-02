import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  binary,
  unique,
  sequence,
  catalogIndex,
} from "../batch36-shared.js";
export type Input = Readonly<{
  readonly callerGpiStatusIds: readonly string[];
  readonly callerTerminalFlags: readonly number[];
  readonly callerCreditedFlags: readonly number[];
  readonly observedStatusIds: readonly string[];
  readonly observedStatusTimesCivilDays: readonly number[];
}>;
export type Output = Readonly<{
  readonly latestObservedStatusId: string;
  readonly callerMappedTerminal: boolean;
  readonly callerMappedCredited: boolean;
  readonly priorTerminalStatusConflict: boolean;
}>;
const inputFields = [
  {
    id: "callerGpiStatusIds",
    label: "Caller gpi status ids",
    kind: "stringList",
  },
  {
    id: "callerTerminalFlags",
    label: "Caller terminal flags",
    kind: "numberList",
  },
  {
    id: "callerCreditedFlags",
    label: "Caller credited flags",
    kind: "numberList",
  },
  { id: "observedStatusIds", label: "Observed status ids", kind: "stringList" },
  {
    id: "observedStatusTimesCivilDays",
    label: "Observed status times civil days",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.callerGpiStatusIds, "statusCatalog");
  for (const v of [input.callerTerminalFlags, input.callerCreditedFlags]) {
    aligned(input.callerGpiStatusIds, v, "catalog");
    binary(v, "flags");
  }
  aligned(
    input.observedStatusIds,
    input.observedStatusTimesCivilDays,
    "observed",
  );
  sequence(input.observedStatusTimesCivilDays, "times");
  const indices = input.observedStatusIds.map((v) =>
      catalogIndex(input.callerGpiStatusIds, v),
    ),
    latest = indices.at(-1)!;
  return {
    latestObservedStatusId: input.observedStatusIds.at(-1)!,
    callerMappedTerminal: !!input.callerTerminalFlags[latest],
    callerMappedCredited: !!input.callerCreditedFlags[latest],
    priorTerminalStatusConflict: indices
      .slice(0, -1)
      .some((i) => input.callerTerminalFlags[i] && i !== latest),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerGpiStatusIds: ["ACSP", "ACCC"],
  callerTerminalFlags: [0, 1],
  callerCreditedFlags: [0, 1],
  observedStatusIds: ["ACSP", "ACCC"],
  observedStatusTimesCivilDays: [1, 2],
} satisfies Input;
export const exampleOutput = {
  latestObservedStatusId: "ACCC",
  callerMappedTerminal: true,
  callerMappedCredited: true,
  priorTerminalStatusConflict: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "banking/gpi-tracking-status-lookup",
  title: "GPI Tracking Status Lookup",
  description:
    "Interpret actual chronological GPI status ledger through caller verified edition mappings, flag conflicting terminal evidence; mapped credit not independent beneficiary receipt proof. Caller independently verifies edition, jurisdiction, applicability and one currency; screening does not establish legal compliance, coverage or bank approval.",
  inputs: inputFields,
  outputs: [
    {
      id: "latestObservedStatusId",
      label: "Latest observed status id",
      kind: "string",
    },
    {
      id: "callerMappedTerminal",
      label: "Caller mapped terminal",
      kind: "boolean",
    },
    {
      id: "callerMappedCredited",
      label: "Caller mapped credited",
      kind: "boolean",
    },
    {
      id: "priorTerminalStatusConflict",
      label: "Prior terminal status conflict",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      callerGpiStatusIds: value.callerGpiStatusIds as readonly string[],
      callerTerminalFlags: value.callerTerminalFlags as readonly number[],
      callerCreditedFlags: value.callerCreditedFlags as readonly number[],
      observedStatusIds: value.observedStatusIds as readonly string[],
      observedStatusTimesCivilDays:
        value.observedStatusTimesCivilDays as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
