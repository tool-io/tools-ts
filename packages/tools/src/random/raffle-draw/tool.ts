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
} from "../batch42-shared.js";

export type Input = Readonly<{
  readonly seed: string;
  readonly count: number;
  readonly eligibleTicketIds: readonly string[];
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const inputFields = [
  { id: "seed", label: "Seed", kind: "string" },
  { id: "count", label: "Count", kind: "number" },
  { id: "eligibleTicketIds", label: "Eligible ticket ids", kind: "stringList" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input, context?: ToolExecutionContext): Output => {
  const random = sourceFor(input.seed, context);
  unique(input.eligibleTicketIds, "tickets");
  const chosen = indices(
    input.eligibleTicketIds.length,
    { ...input, withoutReplacement: true },
    random,
  );
  return {
    result: {
      winningTicketIds: chosen.map((i) => input.eligibleTicketIds[i]),
      undrawnTicketIds: input.eligibleTicketIds.filter(
        (_, i) => !chosen.includes(i),
      ),
      samplingUnit: "eligible-distinct-ticket-not-person",
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
    eligibleTicketIds: ["ticket-a", "ticket-b", "ticket-c"],
  },
} satisfies ToolExample<Input>;
export const tool = createSimpleTool({
  id: "random/raffle-draw",
  title: "Random Raffle Draw Generator",
  description:
    "Draw unique eligible tickets uniformly without replacement; individuals with multiple tickets can win multiple prizes. Caller supplies eligibility. Reproducible PRNG is not secure randomness, audited fairness or legal raffle approval.",
  inputs: inputFields,
  outputs: [
    { id: "result", label: "Reproducible sample and evidence", kind: "object" },
  ],
  calculate: (input, context) => calculate(input as unknown as Input, context),
});
export const run = tool.execute;
export default tool;
