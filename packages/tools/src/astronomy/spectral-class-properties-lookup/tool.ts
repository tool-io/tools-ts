import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedSpectralClassKeys: readonly string[];
  readonly callerVerifiedSpectralClassNotices: readonly string[];
  readonly querySpectralClassKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedSpectralClassKeys",
    label: "Caller verified spectral class keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedSpectralClassNotices",
    label: "Caller verified spectral class notices",
    kind: "stringList",
  },
  {
    id: "querySpectralClassKey",
    label: "Query spectral class key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedSpectralClassKeys,
      input.callerVerifiedSpectralClassNotices,
      input.querySpectralClassKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedSpectralClassKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedSpectralClassNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  querySpectralClassKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/spectral-class-properties-lookup",
  title: "Spectral Class Properties Lookup",
  description:
    "Independently verified stellar spectral subclass/edition properties, type not inferred from one temperature. Exact independently verified context/edition key; not embedded or live reference data. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
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
      callerVerifiedSpectralClassKeys:
        value.callerVerifiedSpectralClassKeys as readonly string[],
      callerVerifiedSpectralClassNotices:
        value.callerVerifiedSpectralClassNotices as readonly string[],
      querySpectralClassKey: value.querySpectralClassKey as string,
    }),
});
export const run = tool.execute;
export default tool;
