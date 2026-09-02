import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedWarreDimensionsKeys: readonly string[];
  readonly callerVerifiedWarreDimensionsNotices: readonly string[];
  readonly queryWarreDimensionsKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedWarreDimensionsKeys",
    label: "Caller verified warre dimensions keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedWarreDimensionsNotices",
    label: "Caller verified warre dimensions notices",
    kind: "stringList",
  },
  {
    id: "queryWarreDimensionsKey",
    label: "Query warre dimensions key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedWarreDimensionsKeys,
      input.callerVerifiedWarreDimensionsNotices,
      input.queryWarreDimensionsKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedWarreDimensionsKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedWarreDimensionsNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryWarreDimensionsKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/warre-box-dimension-lookup",
  title: "Warre Box Dimension Lookup",
  description:
    "Caller exact manufacturer/model independently verified Warre box dimensions. Exact independently verified context/edition key, not live or embedded reference data. Caller independently verifies strain, site, protocol and evidence; not colony-health, treatment, transport-safety or regulatory certification.",
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
      callerVerifiedWarreDimensionsKeys:
        value.callerVerifiedWarreDimensionsKeys as readonly string[],
      callerVerifiedWarreDimensionsNotices:
        value.callerVerifiedWarreDimensionsNotices as readonly string[],
      queryWarreDimensionsKey: value.queryWarreDimensionsKey as string,
    }),
});
export const run = tool.execute;
export default tool;
