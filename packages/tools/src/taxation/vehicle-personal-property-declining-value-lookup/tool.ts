import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch39-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedVehicleDecliningValueKeys: readonly string[];
  readonly callerVerifiedVehicleDecliningValueNotices: readonly string[];
  readonly queryVehicleDecliningValueKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedVehicleDecliningValueKeys",
    label: "Caller verified vehicle declining value keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedVehicleDecliningValueNotices",
    label: "Caller verified vehicle declining value notices",
    kind: "stringList",
  },
  {
    id: "queryVehicleDecliningValueKey",
    label: "Query vehicle declining value key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedVehicleDecliningValueKeys,
      input.callerVerifiedVehicleDecliningValueNotices,
      input.queryVehicleDecliningValueKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedVehicleDecliningValueKeys: [
    "site-a/edition-a",
    "site-a/edition-b",
  ],
  callerVerifiedVehicleDecliningValueNotices: [
    "caller reference a",
    "caller reference b",
  ],
  queryVehicleDecliningValueKey: "site-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "caller reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "taxation/vehicle-personal-property-declining-value-lookup",
  title: "Vehicle Personal Property Declining Value Lookup",
  description:
    "Caller independently verified vehicle/model-year/jurisdiction property-tax depreciation notice. Exact independently verified location/jurisdiction/method/edition reference key, not a live database. Caller independently establishes matching units, evidence, method edition and applicability; output is not compliance, diagnosis, work-safety approval, geological identity or validated hazard prediction.",
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
      callerVerifiedVehicleDecliningValueKeys:
        value.callerVerifiedVehicleDecliningValueKeys as readonly string[],
      callerVerifiedVehicleDecliningValueNotices:
        value.callerVerifiedVehicleDecliningValueNotices as readonly string[],
      queryVehicleDecliningValueKey:
        value.queryVehicleDecliningValueKey as string,
    }),
});
export const run = tool.execute;
export default tool;
