import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedToothEruptionWearAgeKeys: readonly string[];
  readonly callerVerifiedToothEruptionWearAgeNotices: readonly string[];
  readonly queryToothEruptionWearAgeKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedToothEruptionWearAgeKeys",
    label: "Caller verified tooth eruption wear age keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedToothEruptionWearAgeNotices",
    label: "Caller verified tooth eruption wear age notices",
    kind: "stringList",
  },
  {
    id: "queryToothEruptionWearAgeKey",
    label: "Query tooth eruption wear age key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedToothEruptionWearAgeKeys,
      input.callerVerifiedToothEruptionWearAgeNotices,
      input.queryToothEruptionWearAgeKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedToothEruptionWearAgeKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedToothEruptionWearAgeNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryToothEruptionWearAgeKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "archaeology/tooth-eruption-wear-age-domesticate",
  title: "Domesticate Tooth Eruption Wear Age Tool",
  description:
    "Independently taxon/tooth/protocol/edition tooth eruption-wear age reference with intervals, not universal exact animal age. Exact independently verified context/edition key; not embedded or live reference data. Caller independently establishes sample/context/calibration applicability; not definitive chronology, provenance, taxonomy, disease or human identity.",
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
      callerVerifiedToothEruptionWearAgeKeys:
        value.callerVerifiedToothEruptionWearAgeKeys as readonly string[],
      callerVerifiedToothEruptionWearAgeNotices:
        value.callerVerifiedToothEruptionWearAgeNotices as readonly string[],
      queryToothEruptionWearAgeKey:
        value.queryToothEruptionWearAgeKey as string,
    }),
});
export const run = tool.execute;
export default tool;
