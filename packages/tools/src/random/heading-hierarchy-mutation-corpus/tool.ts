import type { ToolExample } from "../../core/example.js";
import type { ToolExecutionContext } from "../../core/definition.js";
import {
  createModelDefinition,
  matchesModelInput,
  modelInputIssues,
} from "../../core/model-definition.js";
import {
  invalidInput,
  toolSuccess,
  type ToolResult,
} from "../../core/result.js";
import { simpleError } from "../../core/simple.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import {
  text,
  label,
  id,
  bool,
  number,
  integer,
  list,
  object,
  enumeration,
  nullable,
  markup,
  parsedSchema,
  choose,
  preview,
  distinct,
  work,
  finite,
  escape,
  parse,
  finish,
} from "../m500b-ui-accessibility-support.js";
import {
  calculateHeadingLevelOrderSequenceChecker,
  headingLevelOrderSequenceCheckerOutputSchema,
  type HeadingLevelOrderSequenceCheckerOutput,
} from "../../html/heading-level-order-sequence-checker/tool.js";

export type Input = {
  readonly headings: readonly {
    readonly level: number;
    readonly text: string;
  }[];
  readonly count: number;
  readonly seed?: number;
};
export type Output = {
  readonly cases: readonly {
    readonly position: number;
    readonly referenceLevels: readonly number[];
    readonly levels: readonly number[];
    readonly referenceHtml: string;
    readonly html: string;
    readonly check: HeadingLevelOrderSequenceCheckerOutput;
  }[];
  readonly randomness: GeneratorReplay;
};
const levels = list(integer(1, 6));
export const inputSchema = object(
  {
    headings: list(object({ level: integer(1, 6), text: label })),
    count: integer(1, 32),
    seed: generatorSeedSchema,
  },
  ["headings", "count"],
);
export const outputSchema = object({
  cases: list(
    object({
      position: integer(1, 31),
      referenceLevels: levels,
      levels,
      referenceHtml: markup,
      html: markup,
      check: headingLevelOrderSequenceCheckerOutputSchema,
    }),
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is Input =>
  matchesModelInput(input, inputSchema);
export const calculateHeadingHierarchyMutationCorpus = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<Output> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    work(input.count, input.headings.length, "count", 128);
    const referenceLevels = input.headings.map((h) => h.level),
      baseline = calculateHeadingLevelOrderSequenceChecker({
        levels: referenceLevels,
      });
    if (!baseline.ok) throw new Error("Validated heading levels rejected");
    if (baseline.output.hasUpwardSkips)
      return simpleError(
        "headings",
        "Reference headings must contain no adjacent upward skip.",
        "invalid_reference_hierarchy",
      );
    const eligible = input.headings.flatMap((_, i) =>
      i > 0 && (referenceLevels[i - 1] ?? 6) <= 4 ? [i] : [],
    );
    if (eligible.length === 0)
      return simpleError(
        "headings",
        "A previous heading at level 1..4 is needed to construct a skip.",
        "unconstructible_skip",
      );
    const render = (levels: readonly number[]) =>
        input.headings
          .map(
            (h, i) =>
              "<h" + levels[i] + ">" + escape(h.text) + "</h" + levels[i] + ">",
          )
          .join(""),
      referenceHtml = render(referenceLevels),
      random = createGeneratorRandom(input.seed, context),
      cases = Array.from({ length: input.count }, () => {
        const position = choose(eligible, random),
          previous = referenceLevels[position - 1];
        if (previous === undefined)
          throw new Error("Heading predecessor absent");
        const levels = [...referenceLevels];
        levels[position] = previous + 2;
        const core = calculateHeadingLevelOrderSequenceChecker({ levels });
        if (!core.ok) throw new Error("Constructed heading levels rejected");
        return {
          position,
          referenceLevels: [...referenceLevels],
          levels,
          referenceHtml,
          html: render(levels),
          check: core.output,
        };
      });
    return toolSuccess(
      finish({ cases, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const headingHierarchyMutationCorpusExample = {
  input: {
    headings: [
      { level: 1, text: "Guide" },
      { level: 2, text: "Setup" },
      { level: 3, text: "Notes" },
    ],
    count: 1,
    seed: 42,
  },
  output: {
    cases: [
      {
        position: 2,
        referenceLevels: [1, 2, 3],
        levels: [1, 2, 4],
        referenceHtml: "<h1>Guide</h1><h2>Setup</h2><h3>Notes</h3>",
        html: "<h1>Guide</h1><h2>Setup</h2><h4>Notes</h4>",
        check: { skippedAt: [2], hasUpwardSkips: true },
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<Input, Output>;
export const headingHierarchyMutationCorpusTool = createModelDefinition<
  Input,
  Output
>({
  id: "random/heading-hierarchy-mutation-corpus",
  title: "Random Heading Hierarchy Mutation Corpus Generator",
  description:
    "Mutate caller heading sequences at a constructible interior position to introduce an upward skip, retaining baseline and mutated markup and the existing outline heuristic.",
  inputSchema,
  outputSchema,
  execute: calculateHeadingHierarchyMutationCorpus,
});
export const runHeadingHierarchyMutationCorpus =
  headingHierarchyMutationCorpusTool.execute;
export default headingHierarchyMutationCorpusTool;
