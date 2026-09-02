import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedSolarIrradianceKeys: readonly string[];
  readonly callerVerifiedSolarIrradianceNotices: readonly string[];
  readonly querySolarIrradianceKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedSolarIrradianceKeys",
    label: "Caller verified solar irradiance keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedSolarIrradianceNotices",
    label: "Caller verified solar irradiance notices",
    kind: "stringList",
  },
  {
    id: "querySolarIrradianceKey",
    label: "Query solar irradiance key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedSolarIrradianceKeys,
      input.callerVerifiedSolarIrradianceNotices,
      input.querySolarIrradianceKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedSolarIrradianceKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedSolarIrradianceNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  querySolarIrradianceKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/solar-constant-watt-per-m2-lookup",
  title: "Solar Constant W/m² Lookup",
  description:
    "Independently verified measurement interval/reference-distance total-solar-irradiance record, not universal immutable solar constant. Exact independently verified context/edition key; not embedded or live reference data. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
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
      callerVerifiedSolarIrradianceKeys:
        value.callerVerifiedSolarIrradianceKeys as readonly string[],
      callerVerifiedSolarIrradianceNotices:
        value.callerVerifiedSolarIrradianceNotices as readonly string[],
      querySolarIrradianceKey: value.querySolarIrradianceKey as string,
    }),
});
export const run = tool.execute;
export default tool;
