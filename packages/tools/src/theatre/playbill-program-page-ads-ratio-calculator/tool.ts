import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  fraction,
  aligned,
  binary,
  sum,
} from "../batch33-shared.js";
export type Input = Readonly<{
  readonly programPageAdFractions: readonly number[];
  readonly pageEvidenceFlags: readonly number[];
  readonly callerMaximumKnownAdFraction: number;
}>;
export type Output = Readonly<{
  readonly knownPageEquivalentAdCount: number;
  readonly knownPageCount: number;
  readonly adShareOfKnownPageArea: number;
  readonly unknownPageCount: number;
  readonly aboveCallerKnownAdBudget: boolean;
}>;
const inputFields = [
  {
    id: "programPageAdFractions",
    label: "Program page ad fractions",
    kind: "numberList",
  },
  { id: "pageEvidenceFlags", label: "Page evidence flags", kind: "numberList" },
  {
    id: "callerMaximumKnownAdFraction",
    label: "Caller maximum known ad fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  input.programPageAdFractions.forEach((v) =>
    fraction(v, "programPageAdFractions"),
  );
  fraction(input.callerMaximumKnownAdFraction, "callerMaximumKnownAdFraction");
  binary(input.pageEvidenceFlags, "pageEvidenceFlags");
  aligned(
    input.programPageAdFractions,
    input.pageEvidenceFlags,
    "programPageAdFractions",
  );
  const known = input.pageEvidenceFlags.filter((v) => v === 1).length;
  if (!known)
    simpleError(
      "pages",
      "At least one observed page required; unknown is not empty editorial space.",
    );
  const ads = sum(
      input.programPageAdFractions.filter(
        (_, i) => input.pageEvidenceFlags[i] === 1,
      ),
    ),
    share = ads / known;
  return {
    knownPageEquivalentAdCount: ads,
    knownPageCount: known,
    adShareOfKnownPageArea: share,
    unknownPageCount: input.pageEvidenceFlags.length - known,
    aboveCallerKnownAdBudget: share > input.callerMaximumKnownAdFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  programPageAdFractions: [1, 0.5, 0, 0],
  pageEvidenceFlags: [1, 1, 1, 0],
  callerMaximumKnownAdFraction: 0.4,
} satisfies Input;
export const exampleOutput = {
  knownPageEquivalentAdCount: 1.5,
  knownPageCount: 3,
  adShareOfKnownPageArea: 0.5,
  unknownPageCount: 1,
  aboveCallerKnownAdBudget: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "theatre/playbill-program-page-ads-ratio-calculator",
  title: "Playbill Program Page Ads Ratio Calculator",
  description:
    "Audit actual fractional program-page ad occupation with unknown pages excluded from known-area denominator; not absolute page count alone, normative ad/editorial ratio or program quality.",
  inputs: inputFields,
  outputs: [
    {
      id: "knownPageEquivalentAdCount",
      label: "Known page equivalent ad count",
      kind: "number",
    },
    { id: "knownPageCount", label: "Known page count", kind: "number" },
    {
      id: "adShareOfKnownPageArea",
      label: "Ad share of known page area",
      kind: "number",
    },
    { id: "unknownPageCount", label: "Unknown page count", kind: "number" },
    {
      id: "aboveCallerKnownAdBudget",
      label: "Above caller known ad budget",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      programPageAdFractions: value.programPageAdFractions as readonly number[],
      pageEvidenceFlags: value.pageEvidenceFlags as readonly number[],
      callerMaximumKnownAdFraction:
        value.callerMaximumKnownAdFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
