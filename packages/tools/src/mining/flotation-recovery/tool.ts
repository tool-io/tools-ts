import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  type SimpleField,
  simpleError,
} from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  aligned,
  binary,
  inventory,
} from "../batch37-shared.js";
export type Input = Readonly<{
  readonly observedIncrementalFlotationMetalTonnes: readonly number[];
  readonly observedFeedMetalTonnes: number;
  readonly knownIncrementAssessmentFlags: readonly number[];
}>;
export type Output = Readonly<{
  readonly knownCumulativeFlotationMetalRecovery: number;
  readonly unassessedIncrementCount: number;
}>;
const inputFields = [
  {
    id: "observedIncrementalFlotationMetalTonnes",
    label: "Observed incremental flotation metal tonnes",
    kind: "numberList",
  },
  {
    id: "observedFeedMetalTonnes",
    label: "Observed feed metal tonnes",
    kind: "number",
  },
  {
    id: "knownIncrementAssessmentFlags",
    label: "Known increment assessment flags",
    kind: "numberList",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Output => {
  positive(input.observedFeedMetalTonnes, "observedFeedMetalTonnes");
  input.observedIncrementalFlotationMetalTonnes.forEach((v) =>
    nonnegative(v, "observedIncrementalFlotationMetalTonnes"),
  );
  binary(input.knownIncrementAssessmentFlags, "knownIncrementAssessmentFlags");
  aligned(
    input.observedIncrementalFlotationMetalTonnes,
    input.knownIncrementAssessmentFlags,
    "observedIncrementalFlotationMetalTonnes",
  );
  const known = inventory(
    input.observedIncrementalFlotationMetalTonnes,
    input.knownIncrementAssessmentFlags,
  );
  if (known.knownTotal > input.observedFeedMetalTonnes)
    simpleError("metal", "Known concentrate metal≤matched feed metal.");
  return {
    knownCumulativeFlotationMetalRecovery:
      known.knownTotal / input.observedFeedMetalTonnes,
    unassessedIncrementCount: known.unassessedCount,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, inputFields);
  return finish(compute(input));
};
export const exampleInput = {
  observedIncrementalFlotationMetalTonnes: [1, 2],
  observedFeedMetalTonnes: 10,
  knownIncrementAssessmentFlags: [1, 0],
} satisfies Input;
export const exampleOutput = {
  knownCumulativeFlotationMetalRecovery: 0.1,
  unassessedIncrementCount: 1,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "mining/flotation-recovery",
  title: "Flotation Recovery Calculator",
  description:
    "Track actual timed incremental flotation metal collections with unknown increments, not complete dry multi-product mass/grade balance or kinetic fit. Caller independently verifies units, applicability and matching conditions; no operational recipe, safety certification, causal efficacy or legal/resource classification is inferred.",
  inputs: inputFields,
  outputs: [
    {
      id: "knownCumulativeFlotationMetalRecovery",
      label: "Known cumulative flotation metal recovery",
      kind: "number",
    },
    {
      id: "unassessedIncrementCount",
      label: "Unassessed increment count",
      kind: "number",
    },
  ],
  calculate: (value) =>
    calculate({
      observedIncrementalFlotationMetalTonnes:
        value.observedIncrementalFlotationMetalTonnes as readonly number[],
      observedFeedMetalTonnes: value.observedFeedMetalTonnes as number,
      knownIncrementAssessmentFlags:
        value.knownIncrementAssessmentFlags as readonly number[],
    }),
});
export const run = tool.execute;
export default tool;
