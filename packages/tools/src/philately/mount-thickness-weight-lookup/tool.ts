import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch42-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedMountWeightMaterialEditionKeys: readonly string[];
  readonly callerVerifiedMountWeightMaterialEditionNotices: readonly string[];
  readonly queryMountWeightMaterialEditionKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedMountWeightMaterialEditionKeys",
    label: "Caller verified mount weight material edition keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedMountWeightMaterialEditionNotices",
    label: "Caller verified mount weight material edition notices",
    kind: "stringList",
  },
  {
    id: "queryMountWeightMaterialEditionKey",
    label: "Query mount weight material edition key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedMountWeightMaterialEditionKeys,
      input.callerVerifiedMountWeightMaterialEditionNotices,
      input.queryMountWeightMaterialEditionKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedMountWeightMaterialEditionKeys: ["a/edition-a", "b/edition-b"],
  callerVerifiedMountWeightMaterialEditionNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryMountWeightMaterialEditionKey: "b/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "philately/mount-thickness-weight-lookup",
  title: "Mount Thickness mil by Stamp Weight Lookup",
  description:
    "Resolve independently verified mount thickness by complete caller weight/material/product specification key. Exact independently verified edition/context reference key, not embedded or current reference data. Caller independently verifies observations, reference edition, units and applicability; not a grading-service certificate, authentication, conservation treatment, actual market price or legal/insurance entitlement.",
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
      callerVerifiedMountWeightMaterialEditionKeys:
        value.callerVerifiedMountWeightMaterialEditionKeys as readonly string[],
      callerVerifiedMountWeightMaterialEditionNotices:
        value.callerVerifiedMountWeightMaterialEditionNotices as readonly string[],
      queryMountWeightMaterialEditionKey:
        value.queryMountWeightMaterialEditionKey as string,
    }),
});
export const run = tool.execute;
export default tool;
