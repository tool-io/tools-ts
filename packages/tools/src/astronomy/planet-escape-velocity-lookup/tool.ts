import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedPlanetEscapeVelocityKeys: readonly string[];
  readonly callerVerifiedPlanetEscapeVelocityNotices: readonly string[];
  readonly queryPlanetEscapeVelocityKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedPlanetEscapeVelocityKeys",
    label: "Caller verified planet escape velocity keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedPlanetEscapeVelocityNotices",
    label: "Caller verified planet escape velocity notices",
    kind: "stringList",
  },
  {
    id: "queryPlanetEscapeVelocityKey",
    label: "Query planet escape velocity key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedPlanetEscapeVelocityKeys,
      input.callerVerifiedPlanetEscapeVelocityNotices,
      input.queryPlanetEscapeVelocityKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedPlanetEscapeVelocityKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedPlanetEscapeVelocityNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryPlanetEscapeVelocityKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/planet-escape-velocity-lookup",
  title: "Planet Escape Velocity Lookup",
  description:
    "Independently verified planet/reference surface-radius escape-speed convention. Exact independently verified context/edition key; not embedded or live reference data. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
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
      callerVerifiedPlanetEscapeVelocityKeys:
        value.callerVerifiedPlanetEscapeVelocityKeys as readonly string[],
      callerVerifiedPlanetEscapeVelocityNotices:
        value.callerVerifiedPlanetEscapeVelocityNotices as readonly string[],
      queryPlanetEscapeVelocityKey:
        value.queryPlanetEscapeVelocityKey as string,
    }),
});
export const run = tool.execute;
export default tool;
