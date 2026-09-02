import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, notice } from "../batch41-shared.js";
export type Input = Readonly<{
  readonly callerVerifiedPlanetMoonInventoryKeys: readonly string[];
  readonly callerVerifiedPlanetMoonInventoryNotices: readonly string[];
  readonly queryPlanetMoonInventoryKey: string;
}>;
export type Output = Readonly<{ readonly matchedCallerNotice: string }>;
const inputFields = [
  {
    id: "callerVerifiedPlanetMoonInventoryKeys",
    label: "Caller verified planet moon inventory keys",
    kind: "stringList",
  },
  {
    id: "callerVerifiedPlanetMoonInventoryNotices",
    label: "Caller verified planet moon inventory notices",
    kind: "stringList",
  },
  {
    id: "queryPlanetMoonInventoryKey",
    label: "Query planet moon inventory key",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  return {
    matchedCallerNotice: notice(
      input.callerVerifiedPlanetMoonInventoryKeys,
      input.callerVerifiedPlanetMoonInventoryNotices,
      input.queryPlanetMoonInventoryKey,
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  callerVerifiedPlanetMoonInventoryKeys: [
    "context-a/edition-a",
    "context-a/edition-b",
  ],
  callerVerifiedPlanetMoonInventoryNotices: [
    "independently verified reference a",
    "independently verified reference b",
  ],
  queryPlanetMoonInventoryKey: "context-a/edition-b",
} satisfies Input;
export const exampleOutput = {
  matchedCallerNotice: "independently verified reference b",
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "astronomy/planet-moons-count-lookup",
  title: "Planet Moon Count Lookup",
  description:
    "Independently verified dated confirmed-moon inventory, not current live counts or candidate confirmation. Exact independently verified context/edition key; not embedded or live reference data. Model only, not an ephemeris, measured stellar identity or observational guarantee.",
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
      callerVerifiedPlanetMoonInventoryKeys:
        value.callerVerifiedPlanetMoonInventoryKeys as readonly string[],
      callerVerifiedPlanetMoonInventoryNotices:
        value.callerVerifiedPlanetMoonInventoryNotices as readonly string[],
      queryPlanetMoonInventoryKey: value.queryPlanetMoonInventoryKey as string,
    }),
});
export const run = tool.execute;
export default tool;
