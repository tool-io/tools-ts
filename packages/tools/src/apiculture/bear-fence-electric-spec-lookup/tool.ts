import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedBearFenceSpecificationKeys: readonly string[];
  readonly callerVerifiedBearFenceSpecificationNotices: readonly string[];
  readonly queryBearFenceSpecificationKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedBearFenceSpecificationKeys",
    label: "Caller verified bear fence specification keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedBearFenceSpecificationNotices",
    label: "Caller verified bear fence specification notices",
    kind: "stringList",
  },
  {
    id: "queryBearFenceSpecificationKey",
    label: "Query bear fence specification key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedBearFenceSpecificationKeys,
      input.callerVerifiedBearFenceSpecificationNotices,
      input.queryBearFenceSpecificationKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedBearFenceSpecificationKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedBearFenceSpecificationNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryBearFenceSpecificationKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/bear-fence-electric-spec-lookup",
  title: "Bear Fence Electric Spec Lookup",
  description:
    "Caller independently verified site/product/jurisdiction bear-fence specification notice; no energizer construction or handling instruction. Exact independently verified context/edition key, not live or embedded reference data. Caller independently verifies strain, site, protocol and evidence; not colony-health, treatment, transport-safety or regulatory certification.",
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
      callerVerifiedBearFenceSpecificationKeys:
        value.callerVerifiedBearFenceSpecificationKeys as readonly string[],
      callerVerifiedBearFenceSpecificationNotices:
        value.callerVerifiedBearFenceSpecificationNotices as readonly string[],
      queryBearFenceSpecificationKey:
        value.queryBearFenceSpecificationKey as string,
    }),
});
export const run = tool.execute;
export default tool;
