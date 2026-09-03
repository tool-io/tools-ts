import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedFloorAssemblyKeys: readonly string[];
  readonly callerVerifiedFloorAssemblyNotices: readonly string[];
  readonly queryFloorAssemblyKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedFloorAssemblyKeys",
    label: "Caller verified floor assembly keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedFloorAssemblyNotices",
    label: "Caller verified floor assembly notices",
    kind: "stringList",
  },
  {
    id: "queryFloorAssemblyKey",
    label: "Query floor assembly key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedFloorAssemblyKeys,
      input.callerVerifiedFloorAssemblyNotices,
      input.queryFloorAssemblyKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedFloorAssemblyKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedFloorAssemblyNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryFloorAssemblyKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dance/marley-subfloor-spring-thickness-lookup",
  title: "Marley Subfloor Spring Thickness Lookup",
  description:
    "Caller independently verified product/site sprung subfloor assembly thickness specification, not load/impact or construction safety approval. Exact independently verified context/edition key; not embedded or live reference data. Caller independently establishes score/style/protocol/reference applicability; not physical readiness, safe training or injury risk diagnosis.",
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
      callerVerifiedFloorAssemblyKeys:
        value.callerVerifiedFloorAssemblyKeys as readonly string[],
      callerVerifiedFloorAssemblyNotices:
        value.callerVerifiedFloorAssemblyNotices as readonly string[],
      queryFloorAssemblyKey: value.queryFloorAssemblyKey as string,
    }),
});
export const run = tool.execute;
export default tool;
