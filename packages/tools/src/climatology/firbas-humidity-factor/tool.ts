import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedFirbasHumidityMethodKeys: readonly string[];
  readonly callerVerifiedFirbasHumidityMethodNotices: readonly string[];
  readonly queryFirbasHumidityMethodKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedFirbasHumidityMethodKeys",
    label: "Caller verified firbas humidity method keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedFirbasHumidityMethodNotices",
    label: "Caller verified firbas humidity method notices",
    kind: "stringList",
  },
  {
    id: "queryFirbasHumidityMethodKey",
    label: "Query firbas humidity method key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedFirbasHumidityMethodKeys,
      input.callerVerifiedFirbasHumidityMethodNotices,
      input.queryFirbasHumidityMethodKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedFirbasHumidityMethodKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedFirbasHumidityMethodNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryFirbasHumidityMethodKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "climatology/firbas-humidity-factor",
  title: "Firbas Humidity Factor Calculator",
  description:
    "Independently verified Firbas method definition/temperature unit/precipitation period/regional reference, not invented universal humidity formula. Exact independently verified context/edition key; not embedded or live reference data. Caller independently establishes homogeneous observation coverage and model/reference applicability; not observed future climate, crop suitability or validated drought severity.",
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
      callerVerifiedFirbasHumidityMethodKeys:
        value.callerVerifiedFirbasHumidityMethodKeys as readonly string[],
      callerVerifiedFirbasHumidityMethodNotices:
        value.callerVerifiedFirbasHumidityMethodNotices as readonly string[],
      queryFirbasHumidityMethodKey:
        value.queryFirbasHumidityMethodKey as string,
    }),
});
export const run = tool.execute;
export default tool;
