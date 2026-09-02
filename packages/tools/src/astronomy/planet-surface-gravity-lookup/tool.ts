import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedPlanetGravityKeys: readonly string[];
  readonly callerVerifiedPlanetGravityNotices: readonly string[];
  readonly queryPlanetGravityKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedPlanetGravityKeys",
    label: "Caller verified planet gravity keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedPlanetGravityNotices",
    label: "Caller verified planet gravity notices",
    kind: "stringList",
  },
  {
    id: "queryPlanetGravityKey",
    label: "Query planet gravity key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedPlanetGravityKeys,
      input.callerVerifiedPlanetGravityNotices,
      input.queryPlanetGravityKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedPlanetGravityKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedPlanetGravityNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryPlanetGravityKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/planet-surface-gravity-lookup",
  title: "Planet Surface Gravity Lookup",
  description:
    "Independently verified planet/reference surface or pressure-level gravity convention. Exact independently verified context/edition key; not embedded or live reference data. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
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
      callerVerifiedPlanetGravityKeys:
        value.callerVerifiedPlanetGravityKeys as readonly string[],
      callerVerifiedPlanetGravityNotices:
        value.callerVerifiedPlanetGravityNotices as readonly string[],
      queryPlanetGravityKey: value.queryPlanetGravityKey as string,
    }),
});
export const run = tool.execute;
export default tool;
