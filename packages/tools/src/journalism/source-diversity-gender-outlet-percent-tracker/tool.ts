import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import { validateInput, finish, unique, aligned } from "../batch-shared.js";
export type Input = Readonly<{
  readonly sourceIds: readonly string[];
  readonly callerGenderLabels: readonly string[];
  readonly callerOutletLabels: readonly string[];
}>;
export type Output = Readonly<{
  readonly observedGenderLabels: readonly string[];
  readonly genderCounts: readonly number[];
  readonly genderSharesOfKnownEvidence: readonly number[];
  readonly unknownGenderSourceCount: number;
  readonly observedOutletLabels: readonly string[];
  readonly outletCounts: readonly number[];
  readonly outletSharesOfKnownEvidence: readonly number[];
  readonly unknownOutletSourceCount: number;
}>;
const inputFields = [
  { id: "sourceIds", label: "Source ids", kind: "stringList" },
  {
    id: "callerGenderLabels",
    label: "Caller gender labels",
    kind: "stringList",
  },
  {
    id: "callerOutletLabels",
    label: "Caller outlet labels",
    kind: "stringList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  aligned(input.sourceIds, input.callerGenderLabels, "sourceIds");
  aligned(input.sourceIds, input.callerOutletLabels, "sourceIds");
  unique(input.sourceIds, "sources");
  const tally = (values: readonly string[]) => {
    const known = values.filter((s) => s !== "");
    if (known.some((s) => !s.trim()))
      simpleError(
        "label",
        "Exact caller labels or empty unknown sentinel required.",
      );
    const labels = [...new Set(known)],
      counts = labels.map((s) => known.filter((v) => v === s).length);
    return {
      labels,
      counts,
      shares: counts.map((v) => v / known.length),
      unknown: values.length - known.length,
    };
  };
  const g = tally(input.callerGenderLabels),
    o = tally(input.callerOutletLabels);
  return {
    observedGenderLabels: g.labels,
    genderCounts: g.counts,
    genderSharesOfKnownEvidence: g.shares,
    unknownGenderSourceCount: g.unknown,
    observedOutletLabels: o.labels,
    outletCounts: o.counts,
    outletSharesOfKnownEvidence: o.shares,
    unknownOutletSourceCount: o.unknown,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sourceIds: ["a", "b", "c"],
  callerGenderLabels: ["x", "y", ""],
  callerOutletLabels: ["local", "local", "national"],
} satisfies Input;
export const exampleOutput = {
  observedGenderLabels: ["x", "y"],
  genderCounts: [1, 1],
  genderSharesOfKnownEvidence: [0.5, 0.5],
  unknownGenderSourceCount: 1,
  observedOutletLabels: ["local", "national"],
  outletCounts: [2, 1],
  outletSharesOfKnownEvidence: [0.6666666666666666, 0.3333333333333333],
  unknownOutletSourceCount: 0,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/source-diversity-gender-outlet-percent-tracker",
  title: "Source Diversity Gender Outlet Percent Tracker",
  description:
    "Track actual distinct source records under caller self-reported gender/outlet labels with missing values separate and conditional known-evidence denominators; no gender inference from names, fixed binary taxonomy or quota judgement.",
  inputs: inputFields,
  outputs: [
    {
      id: "observedGenderLabels",
      label: "Observed gender labels",
      kind: "stringList",
    },
    { id: "genderCounts", label: "Gender counts", kind: "numberList" },
    {
      id: "genderSharesOfKnownEvidence",
      label: "Gender shares of known evidence",
      kind: "numberList",
    },
    {
      id: "unknownGenderSourceCount",
      label: "Unknown gender source count",
      kind: "number",
    },
    {
      id: "observedOutletLabels",
      label: "Observed outlet labels",
      kind: "stringList",
    },
    { id: "outletCounts", label: "Outlet counts", kind: "numberList" },
    {
      id: "outletSharesOfKnownEvidence",
      label: "Outlet shares of known evidence",
      kind: "numberList",
    },
    {
      id: "unknownOutletSourceCount",
      label: "Unknown outlet source count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      sourceIds: value.sourceIds as readonly string[],
      callerGenderLabels: value.callerGenderLabels as readonly string[],
      callerOutletLabels: value.callerOutletLabels as readonly string[],
    }),
});
export const run = tool.execute;
export default tool;
