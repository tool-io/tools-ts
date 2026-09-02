import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedPlanetRotationKeys: readonly string[];
  readonly callerVerifiedPlanetRotationNotices: readonly string[];
  readonly queryPlanetRotationKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedPlanetRotationKeys",
    label: "Caller verified planet rotation keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedPlanetRotationNotices",
    label: "Caller verified planet rotation notices",
    kind: "stringList",
  },
  {
    id: "queryPlanetRotationKey",
    label: "Query planet rotation key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedPlanetRotationKeys,
      input.callerVerifiedPlanetRotationNotices,
      input.queryPlanetRotationKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedPlanetRotationKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedPlanetRotationNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryPlanetRotationKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/planet-day-length-lookup",
  title: "Planet Day Length Lookup",
  description:
    "Independently verified planet sidereal/solar rotation sign and period convention. Exact independently verified context/edition key; not embedded or live reference data. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
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
      callerVerifiedPlanetRotationKeys:
        value.callerVerifiedPlanetRotationKeys as readonly string[],
      callerVerifiedPlanetRotationNotices:
        value.callerVerifiedPlanetRotationNotices as readonly string[],
      queryPlanetRotationKey: value.queryPlanetRotationKey as string,
    }),
});
export const run = tool.execute;
export default tool;
