import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  integer,
  sumMoney,
  nonnegative,
  positive,
  fraction,
  bounded,
  aligned,
} from "../batch-shared.js";
export type Input = Readonly<{
  readonly sectionWordCounts: readonly number[];
  readonly leadContextDetailUnknownCodes: readonly number[];
  readonly callerMinimumLeadFraction: number;
}>;
export type Output = Readonly<{
  readonly leadContextDetailUnknownWordTotals: readonly number[];
  readonly leadContextDetailUnknownFractions: readonly number[];
  readonly leadShareMeetsCallerPolicy: boolean;
}>;
const inputFields = [
  { id: "sectionWordCounts", label: "Section word counts", kind: "numberList" },
  {
    id: "leadContextDetailUnknownCodes",
    label: "Lead context detail unknown codes",
    kind: "numberList",
  },
  {
    id: "callerMinimumLeadFraction",
    label: "Caller minimum lead fraction",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  fraction(input.callerMinimumLeadFraction, "callerMinimumLeadFraction");
  input.sectionWordCounts.forEach((v) => integer(v, "sectionWordCounts"));
  aligned(
    input.sectionWordCounts,
    input.leadContextDetailUnknownCodes,
    "sectionWordCounts",
  );
  input.sectionWordCounts.forEach((v) => nonnegative(v, "words"));
  input.leadContextDetailUnknownCodes.forEach((v) =>
    bounded(v, "sectionCode", 0, 3),
  );
  const totals = [0, 1, 2, 3].map((c) =>
      sumMoney(
        input.sectionWordCounts.filter(
          (_, i) => input.leadContextDetailUnknownCodes[i] === c,
        ),
      ),
    ),
    total = positive(sumMoney(totals), "words"),
    shares = totals.map((v) => v / total);
  return {
    leadContextDetailUnknownWordTotals: totals,
    leadContextDetailUnknownFractions: shares,
    leadShareMeetsCallerPolicy: shares[0] >= input.callerMinimumLeadFraction,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  sectionWordCounts: [100, 200, 100],
  leadContextDetailUnknownCodes: [0, 1, 2],
  callerMinimumLeadFraction: 0.2,
} satisfies Input;
export const exampleOutput = {
  leadContextDetailUnknownWordTotals: [100, 200, 100, 0],
  leadContextDetailUnknownFractions: [0.25, 0.5, 0.25, 0],
  leadShareMeetsCallerPolicy: true,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "journalism/inverted-pyramid-section-proportion-guide",
  title: "Inverted Pyramid Section Proportion Guide",
  description:
    "Audit caller annotated article section proportions with explicit minimum lead share and unknown bucket; does not infer inverted-pyramid semantics from raw copy or invent ideal proportions.",
  inputs: inputFields,
  outputs: [
    {
      id: "leadContextDetailUnknownWordTotals",
      label: "Lead context detail unknown word totals",
      kind: "numberList",
    },
    {
      id: "leadContextDetailUnknownFractions",
      label: "Lead context detail unknown fractions",
      kind: "numberList",
    },
    {
      id: "leadShareMeetsCallerPolicy",
      label: "Lead share meets caller policy",
      kind: "boolean",
    },
  ],
  calculate: (value) =>
    calculate({
      sectionWordCounts: value.sectionWordCounts as readonly number[],
      leadContextDetailUnknownCodes:
        value.leadContextDetailUnknownCodes as readonly number[],
      callerMinimumLeadFraction: value.callerMinimumLeadFraction as number,
    }),
});
export const run = tool.execute;
export default tool;
