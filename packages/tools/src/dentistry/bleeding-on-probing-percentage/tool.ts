import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, knownRate } from "../batch47-shared.js";
export type Input = Readonly<{
  readonly callerExaminedSiteIds: readonly string[];
  readonly independentlyObservedBleedingFlags: readonly number[];
  readonly siteEvidenceKnownFlags: readonly number[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "callerExaminedSiteIds",
    label: "Caller examined site ids",
    kind: "stringList",
  },
  {
    id: "independentlyObservedBleedingFlags",
    label: "Independently observed bleeding flags",
    kind: "numberList",
  },
  {
    id: "siteEvidenceKnownFlags",
    label: "Site evidence known flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  return knownRate(
    input.callerExaminedSiteIds,
    input.independentlyObservedBleedingFlags,
    input.siteEvidenceKnownFlags,
  );
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    callerExaminedSiteIds: ["a", "b", "c"],
    independentlyObservedBleedingFlags: [1, 0, 1],
    siteEvidenceKnownFlags: [1, 1, 0],
  },
  output: {
    result: {
      observedKnownPositivePercent: 50,
      knownObservationCount: 2,
      unknownObservationIds: ["c"],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "dentistry/bleeding-on-probing-percentage",
  title: "Bleeding on Probing Percentage Calculator",
  description:
    "Known-positive percentage for actual independently assessed bleeding-on-probing sites with distinct actual site IDs and unknown evidence retained; examination/protocol qualification external. Not universality, whole-mouth imputation or disease diagnosis.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Qualified observation, conditional calculation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
