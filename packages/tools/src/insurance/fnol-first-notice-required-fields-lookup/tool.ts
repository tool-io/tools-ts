import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  aligned,
  binary,
  unique,
} from "../batch35-shared.js";
export type Input = Readonly<{
  readonly callerFnolFieldIds: readonly string[];
  readonly callerRequiredFnolFieldFlags: readonly number[];
  readonly observedPresentFnolFieldFlags: readonly number[];
  readonly observedVerifiedFnolFieldFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly callerMissingRequiredFnolFieldIds: readonly string[];
  readonly callerPresentUnverifiedFnolFieldIds: readonly string[];
  readonly callerRequiredFnolFieldsPresent: boolean;
}>;
const inputFields = [
  {
    id: "callerFnolFieldIds",
    label: "Caller fnol field ids",
    kind: "stringList",
  },
  {
    id: "callerRequiredFnolFieldFlags",
    label: "Caller required fnol field flags",
    kind: "numberList",
  },
  {
    id: "observedPresentFnolFieldFlags",
    label: "Observed present fnol field flags",
    kind: "numberList",
  },
  {
    id: "observedVerifiedFnolFieldFlags",
    label: "Observed verified fnol field flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  unique(input.callerFnolFieldIds, "fields");
  for (const flags of [
    input.callerRequiredFnolFieldFlags,
    input.observedPresentFnolFieldFlags,
    input.observedVerifiedFnolFieldFlags,
  ]) {
    aligned(input.callerFnolFieldIds, flags, "fields");
    binary(flags, "fields");
  }
  if (
    input.observedVerifiedFnolFieldFlags.some(
      (v, i) => v && !input.observedPresentFnolFieldFlags[i],
    )
  )
    simpleError("evidence", "Absent fields cannot be marked verified.");
  const missing = input.callerFnolFieldIds.filter(
    (_, i) =>
      input.callerRequiredFnolFieldFlags[i] &&
      !input.observedPresentFnolFieldFlags[i],
  );
  return {
    callerMissingRequiredFnolFieldIds: missing,
    callerPresentUnverifiedFnolFieldIds: input.callerFnolFieldIds.filter(
      (_, i) =>
        input.observedPresentFnolFieldFlags[i] &&
        !input.observedVerifiedFnolFieldFlags[i],
    ),
    callerRequiredFnolFieldsPresent:
      input.callerRequiredFnolFieldFlags.some((v) => v === 1) &&
      !missing.length,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerFnolFieldIds: ["policy", "date", "description"],
  callerRequiredFnolFieldFlags: [1, 1, 0],
  observedPresentFnolFieldFlags: [1, 0, 1],
  observedVerifiedFnolFieldFlags: [1, 0, 0],
} satisfies Input;
export const exampleOutput = {
  callerMissingRequiredFnolFieldIds: ["date"],
  callerPresentUnverifiedFnolFieldIds: ["description"],
  callerRequiredFnolFieldsPresent: false,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "insurance/fnol-first-notice-required-fields-lookup",
  title: "FNOL First Notice Required Fields Lookup",
  description:
    "Audit actual first-notice field presence separately from verified truth under caller required field policy; no invented notice requirements, automated claim submission or completeness establishes coverage.",
  inputs: inputFields,
  outputs: [
    {
      id: "callerMissingRequiredFnolFieldIds",
      label: "Caller missing required fnol field ids",
      kind: "stringList",
    },
    {
      id: "callerPresentUnverifiedFnolFieldIds",
      label: "Caller present unverified fnol field ids",
      kind: "stringList",
    },
    {
      id: "callerRequiredFnolFieldsPresent",
      label: "Caller required fnol fields present",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      callerFnolFieldIds: value.callerFnolFieldIds as readonly string[],
      callerRequiredFnolFieldFlags:
        value.callerRequiredFnolFieldFlags as readonly number[],
      observedPresentFnolFieldFlags:
        value.observedPresentFnolFieldFlags as readonly number[],
      observedVerifiedFnolFieldFlags:
        value.observedVerifiedFnolFieldFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
