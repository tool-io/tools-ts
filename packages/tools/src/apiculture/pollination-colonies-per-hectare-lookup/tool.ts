import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedPollinationColonyDensityKeys: readonly string[];
  readonly callerVerifiedPollinationColonyDensityNotices: readonly string[];
  readonly queryPollinationColonyDensityKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedPollinationColonyDensityKeys",
    label: "Caller verified pollination colony density keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedPollinationColonyDensityNotices",
    label: "Caller verified pollination colony density notices",
    kind: "stringList",
  },
  {
    id: "queryPollinationColonyDensityKey",
    label: "Query pollination colony density key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedPollinationColonyDensityKeys,
      input.callerVerifiedPollinationColonyDensityNotices,
      input.queryPollinationColonyDensityKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedPollinationColonyDensityKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedPollinationColonyDensityNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryPollinationColonyDensityKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/pollination-colonies-per-hectare-lookup",
  title: "Pollination Colonies Per Hectare Lookup",
  description:
    "Caller independently verified crop/site/contract/strength pollination density notice, not universal colony-per-hectare rule. Exact independently verified context/edition key, not live or embedded reference data. Caller independently verifies strain, site, protocol and evidence; not colony-health, treatment, transport-safety or regulatory certification.",
  inputs: inputFields,
  outputs: [
    {
      id: "matchedCallerNotice",
      label: "Matched caller notice",
      kind: "string",
    },
  ],
  calculate: (value) =>
    calculate({
      callerVerifiedPollinationColonyDensityKeys:
        value.callerVerifiedPollinationColonyDensityKeys as readonly string[],
      callerVerifiedPollinationColonyDensityNotices:
        value.callerVerifiedPollinationColonyDensityNotices as readonly string[],
      queryPollinationColonyDensityKey:
        value.queryPollinationColonyDensityKey as string,
    }),
});
export const run = tool.execute;
export default tool;
