import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedMkkLuminosityClassKeys: readonly string[];
  readonly callerVerifiedMkkLuminosityClassNotices: readonly string[];
  readonly queryMkkLuminosityClassKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedMkkLuminosityClassKeys",
    label: "Caller verified mkk luminosity class keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedMkkLuminosityClassNotices",
    label: "Caller verified mkk luminosity class notices",
    kind: "stringList",
  },
  {
    id: "queryMkkLuminosityClassKey",
    label: "Query mkk luminosity class key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedMkkLuminosityClassKeys,
      input.callerVerifiedMkkLuminosityClassNotices,
      input.queryMkkLuminosityClassKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedMkkLuminosityClassKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedMkkLuminosityClassNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryMkkLuminosityClassKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/luminosity-class-mkk-lookup",
  title: "MKK Luminosity Class Lookup",
  description:
    "Independently verified MK luminosity class descriptor, spectral classification not automatic radius/luminosity inference. Exact independently verified context/edition key; not embedded or live reference data. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
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
      callerVerifiedMkkLuminosityClassKeys:
        value.callerVerifiedMkkLuminosityClassKeys as readonly string[],
      callerVerifiedMkkLuminosityClassNotices:
        value.callerVerifiedMkkLuminosityClassNotices as readonly string[],
      queryMkkLuminosityClassKey: value.queryMkkLuminosityClassKey as string,
    }),
});
export const run = tool.execute;
export default tool;
