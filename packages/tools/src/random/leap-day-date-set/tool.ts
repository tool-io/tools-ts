import type { ToolExecutionContext } from "../../core/definition.js";
import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  simpleError,
  type SimpleField,
} from "../../core/simple.js";
import {
  validateRandomInput,
  finish,
  sourceFor,
  indices,
  unique,
  dayOffset,
} from "../batch42-shared.js";
import weekday from "../../date/iso-weekday/tool.js";

export type Input = Readonly<{
  readonly seed: string;
  readonly count: number;
  readonly withoutReplacement: boolean;
  readonly candidateDates: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const inputFields = [
  { id: "seed", label: "Seed", kind: "string" },
  { id: "count", label: "Count", kind: "number" },
  { id: "withoutReplacement", label: "Without replacement", kind: "boolean" },
  { id: "candidateDates", label: "Candidate dates", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext): Output => {
  const random = sourceFor(input.seed, context);
  unique(input.candidateDates, "candidate dates");
  input.candidateDates.forEach((v) => dayOffset(v, 0));
  const eligible = input.candidateDates.filter((v) => v.slice(5) === "02-29");
  const chosen = indices(eligible.length, input, random);
  return {
    result: {
      dates: chosen.map((i) => eligible[i]),
      eligibleCandidateDates: eligible,
      excludedCandidateDates: input.candidateDates.filter(
        (v) => !eligible.includes(v),
      ),
      eligibleEntryIndices: chosen,
    },
  };
};
export const calculate = (
  input: Input,
  context?: ToolExecutionContext,
): Output => {
  validateRandomInput(input, inputFields);
  return finish(compute(input, context));
};
export const example = {
  input: {
    seed: "tool.io/batch42",
    count: 1,
    withoutReplacement: true,
    candidateDates: ["2024-02-29", "2028-02-29"],
  },
} satisfies ToolExample<Input>;
export const tool = createSimpleTool({
  id: "random/leap-day-date-set",
  title: "Random Leap-Day Date Set Generator",
  description:
    "Uniformly sample actual supplied eligible leap-daydates, not dates inferred from the machine clock. Caller business weekdays/holiday calendar or exact ISO weekday is explicit; leap-day candidates must be real civil February29dates. Infeasible empty inventories or excessive unique requests fail. No jurisdiction-specific trading or business-day inference.",
  inputs: inputFields,
  outputs: [
    { id: "result", label: "Reproducible sample and evidence", kind: "object" },
  ],
  calculate: (input, context) => calculate(input as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
