import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  itemTotals,
} from "../batch47-shared.js";
export type Input = Readonly<{
  readonly independentlyCodedMocaDomainTotals: readonly number[];
  readonly domainKnownFlags: readonly number[];
  readonly callerVerifiedApplicableEducationCorrectionPoints: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "independentlyCodedMocaDomainTotals",
    label: "Independently coded moca domain totals",
    kind: "numberList",
  },
  { id: "domainKnownFlags", label: "Domain known flags", kind: "numberList" },
  {
    id: "callerVerifiedApplicableEducationCorrectionPoints",
    label: "Caller verified applicable education correction points",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const t = itemTotals(
    input.independentlyCodedMocaDomainTotals,
    input.domainKnownFlags,
    [5, 3, 6, 3, 2, 5, 6],
    [0, 0, 0, 0, 0, 0, 0],
  );
  bounded(
    input.callerVerifiedApplicableEducationCorrectionPoints,
    "education-correction",
    0,
    1,
  );
  return {
    knownRawDomainSum: t.knownItemSum,
    minimumPossibleCorrectedTotal: Math.min(
      30,
      t.minimumPossibleTotal +
        input.callerVerifiedApplicableEducationCorrectionPoints,
    ),
    maximumPossibleCorrectedTotal: Math.min(
      30,
      t.maximumPossibleTotal +
        input.callerVerifiedApplicableEducationCorrectionPoints,
    ),
    unknownDomainIndices: t.unknownItemIndices,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: {
    independentlyCodedMocaDomainTotals: [1, 1, 1, 1, 1, 1, 1],
    domainKnownFlags: [1, 1, 1, 1, 1, 1, 1],
    callerVerifiedApplicableEducationCorrectionPoints: 1,
  },
  output: {
    result: {
      knownRawDomainSum: 7,
      minimumPossibleCorrectedTotal: 8,
      maximumPossibleCorrectedTotal: 8,
      unknownDomainIndices: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "neuroscience/moca-total",
  title: "MoCA Total Calculator",
  description:
    "MoCA30-point domain aggregation in visuospatial/executive, naming, attention, language, abstraction, delayed recall, orientation order. Education correction must be independently applicable under actual version; capped30, unknown domain bounds retained. No licensed task reproduction, normative interpretation or diagnosis.",
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
