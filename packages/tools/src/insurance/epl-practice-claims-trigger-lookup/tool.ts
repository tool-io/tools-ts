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
  readonly callerEplTriggerIds: readonly string[];
  readonly callerVerifiedRequiredTriggerFlags: readonly number[];
  readonly observedTriggerPresentFlags: readonly number[];
  readonly triggerEvidenceFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerKnownMissingEplTriggers: readonly string[];
  readonly callerUnresolvedEplTriggers: readonly string[];
  readonly callerRequiredEplTriggersEvidenced: boolean;
}>;
const inputFields = [
  {
    id: "callerEplTriggerIds",
    label: "Caller epl trigger ids",
    kind: "stringList",
  },
  {
    id: "callerVerifiedRequiredTriggerFlags",
    label: "Caller verified required trigger flags",
    kind: "numberList",
  },
  {
    id: "observedTriggerPresentFlags",
    label: "Observed trigger present flags",
    kind: "numberList",
  },
  {
    id: "triggerEvidenceFlags",
    label: "Trigger evidence flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.callerEplTriggerIds, "triggers");
  for (const flags of [
    input.callerVerifiedRequiredTriggerFlags,
    input.observedTriggerPresentFlags,
    input.triggerEvidenceFlags,
  ]) {
    aligned(input.callerEplTriggerIds, flags, "triggers");
    binary(flags, "triggers");
  }
  const missing = input.callerEplTriggerIds.filter(
      (_, i) =>
        input.callerVerifiedRequiredTriggerFlags[i] &&
        input.triggerEvidenceFlags[i] &&
        !input.observedTriggerPresentFlags[i],
    ),
    unknown = input.callerEplTriggerIds.filter(
      (_, i) =>
        input.callerVerifiedRequiredTriggerFlags[i] &&
        !input.triggerEvidenceFlags[i],
    );
  return {
    callerKnownMissingEplTriggers: missing,
    callerUnresolvedEplTriggers: unknown,
    callerRequiredEplTriggersEvidenced:
      input.callerVerifiedRequiredTriggerFlags.some((v) => v === 1) &&
      !missing.length &&
      !unknown.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerEplTriggerIds: ["allegation", "employment"],
  callerVerifiedRequiredTriggerFlags: [1, 1],
  observedTriggerPresentFlags: [1, 0],
  triggerEvidenceFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  callerKnownMissingEplTriggers: [],
  callerUnresolvedEplTriggers: ["employment"],
  callerRequiredEplTriggersEvidenced: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/epl-practice-claims-trigger-lookup",
  title: "EPL Practices Claims Trigger Lookup",
  description:
    "Audit actual EPL claim trigger annotations against caller verified required trigger set, preserving unknowns; no determining employment law, discrimination/harassment truth or policy coverage.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerKnownMissingEplTriggers",
      label: "Caller known missing epl triggers",
      kind: "stringList",
    },
    {
      id: "callerUnresolvedEplTriggers",
      label: "Caller unresolved epl triggers",
      kind: "stringList",
    },
    {
      id: "callerRequiredEplTriggersEvidenced",
      label: "Caller required epl triggers evidenced",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      callerEplTriggerIds: value.callerEplTriggerIds as readonly string[],
      callerVerifiedRequiredTriggerFlags:
        value.callerVerifiedRequiredTriggerFlags as readonly number[],
      observedTriggerPresentFlags:
        value.observedTriggerPresentFlags as readonly number[],
      triggerEvidenceFlags: value.triggerEvidenceFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
