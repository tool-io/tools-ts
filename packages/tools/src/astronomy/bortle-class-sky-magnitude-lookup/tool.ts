import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedBortleSkyKeys: readonly string[];
  readonly callerVerifiedBortleSkyNotices: readonly string[];
  readonly queryBortleSkyKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedBortleSkyKeys",
    label: "Caller verified bortle sky keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedBortleSkyNotices",
    label: "Caller verified bortle sky notices",
    kind: "stringList",
  },
  { id: "queryBortleSkyKey", label: "Query bortle sky key", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedBortleSkyKeys,
      input.callerVerifiedBortleSkyNotices,
      input.queryBortleSkyKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedBortleSkyKeys: ["context-a/edition-a", "context-a/edition-b"],
  callerVerifiedBortleSkyNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryBortleSkyKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/bortle-class-sky-magnitude-lookup",
  title: "Bortle Class Sky Magnitude Lookup",
  description:
    "Independently verified site/observer/definition Bortle and limiting magnitude reference; ordinal class not an exact sky luminance. Exact independently verified context/edition key; not embedded or live reference data. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
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
      callerVerifiedBortleSkyKeys:
        value.callerVerifiedBortleSkyKeys as readonly string[],
      callerVerifiedBortleSkyNotices:
        value.callerVerifiedBortleSkyNotices as readonly string[],
      queryBortleSkyKey: value.queryBortleSkyKey as string,
    }),
});
export const run = tool.execute;
export default tool;
