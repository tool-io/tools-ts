import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch40-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedAlmondRentalWindowKeys: readonly string[];
  readonly callerVerifiedAlmondRentalWindowNotices: readonly string[];
  readonly queryAlmondRentalWindowKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedAlmondRentalWindowKeys",
    label: "Caller verified almond rental window keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedAlmondRentalWindowNotices",
    label: "Caller verified almond rental window notices",
    kind: "stringList",
  },
  {
    id: "queryAlmondRentalWindowKey",
    label: "Query almond rental window key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedAlmondRentalWindowKeys,
      input.callerVerifiedAlmondRentalWindowNotices,
      input.queryAlmondRentalWindowKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedAlmondRentalWindowKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedAlmondRentalWindowNotices: [
    "independent reference a",
    "independent reference b",
  ],
  queryAlmondRentalWindowKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independent reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "apiculture/almond-bloom-rental-period-lookup",
  title: "Almond Bloom Rental Period Lookup",
  description:
    "Caller independently verified orchard/year/contract almond bloom service window notice, not current bloom date. Exact independently verified context/edition key, not live or embedded reference data. Caller independently verifies strain, site, protocol and evidence; not colony-health, treatment, transport-safety or regulatory certification.",
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
      callerVerifiedAlmondRentalWindowKeys:
        value.callerVerifiedAlmondRentalWindowKeys as readonly string[],
      callerVerifiedAlmondRentalWindowNotices:
        value.callerVerifiedAlmondRentalWindowNotices as readonly string[],
      queryAlmondRentalWindowKey: value.queryAlmondRentalWindowKey as string,
    }),
});
export const run = tool.execute;
export default tool;
