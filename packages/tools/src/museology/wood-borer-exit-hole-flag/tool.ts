import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, lines } from "../shared.js";
export type Input = Readonly<{
  readonly previousMappedHoleIds: string;
  readonly currentMappedHoleIds: string;
  readonly currentSurfaceAssessable: boolean;
}>;
export type Output = Readonly<{
  readonly newObservedHoleIds: readonly string[];
  readonly noLongerMappedHoleIds: readonly string[];
  readonly newHoleActivityFlag: boolean;
}>;
const inputFields = [
  {
    id: "previousMappedHoleIds",
    label: "Previous mapped hole ids",
    kind: "string",
  },
  {
    id: "currentMappedHoleIds",
    label: "Current mapped hole ids",
    kind: "string",
  },
  {
    id: "currentSurfaceAssessable",
    label: "Current surface assessable",
    kind: "boolean",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  const old = lines(input.previousMappedHoleIds, "previous", true),
    now = lines(input.currentMappedHoleIds, "current", true);
  if (
    !input.currentSurfaceAssessable ||
    new Set(old).size !== old.length ||
    new Set(now).size !== now.length
  )
    simpleError(
      "mapping",
      "Assessable comparable surface and unique stable hole identifiers required.",
    );
  const a = new Set(old),
    b = new Set(now),
    fresh = now.filter((v) => !a.has(v));
  return {
    newObservedHoleIds: fresh,
    noLongerMappedHoleIds: old.filter((v) => !b.has(v)),
    newHoleActivityFlag: fresh.length > 0,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  previousMappedHoleIds: "A\nB",
  currentMappedHoleIds: "B\nC",
  currentSurfaceAssessable: true,
} satisfies Input;
export const exampleOutput = {
  newObservedHoleIds: ["C"],
  noLongerMappedHoleIds: ["A"],
  newHoleActivityFlag: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "museology/wood-borer-exit-hole-flag",
  title: "Wood Borer Exit Hole New Activity Flag Checker",
  description:
    "Compare stable mapped hole identities across matched assessable surfaces, retaining disappeared mappings; new holes are observation flags, not proof of active wood-borer species or treatment efficacy.",
  inputs: inputFields,
  outputs: [
    {
      id: "newObservedHoleIds",
      label: "New observed hole ids",
      kind: "stringList",
    },
    {
      id: "noLongerMappedHoleIds",
      label: "No longer mapped hole ids",
      kind: "stringList",
    },
    {
      id: "newHoleActivityFlag",
      label: "New hole activity flag",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      previousMappedHoleIds: value.previousMappedHoleIds as string,
      currentMappedHoleIds: value.currentMappedHoleIds as string,
      currentSurfaceAssessable: value.currentSurfaceAssessable as boolean,
    }),
});
export const run = tool.execute;
export default tool;
