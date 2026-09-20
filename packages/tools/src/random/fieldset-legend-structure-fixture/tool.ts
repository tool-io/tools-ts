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
  calculateFieldsetLegendA11yPairChecker,
  fieldsetLegendA11yPairCheckerOutputSchema,
  type FieldsetLegendA11yPairCheckerOutput,
} from "../../html/fieldset-legend-a11y-pair-checker/tool.js";

export type Input = {
  readonly legend: string;
  readonly fieldLabels: readonly string[];
  readonly semanticKey: string;
  readonly modes: readonly ("first" | "missing" | "last" | "duplicate")[];
  readonly count: number;
  readonly seed?: number;
};
export type Output = {
  readonly cases: readonly {
    readonly mode: "first" | "missing" | "last" | "duplicate";
    readonly semanticKey: string;
    readonly children: readonly string[];
    readonly html: string;
    readonly structure: FieldsetLegendA11yPairCheckerOutput;
  }[];
  readonly randomness: GeneratorReplay;
};
const mode = enumeration(["first", "missing", "last", "duplicate"]);
export const inputSchema = object(
  {
    legend: label,
    fieldLabels: list(label, 16),
    semanticKey: label,
    modes: list(mode, 4),
    count: integer(1, 32),
    seed: generatorSeedSchema,
  },
  ["legend", "fieldLabels", "semanticKey", "modes", "count"],
);
export const outputSchema = object({
  cases: list(
    object({
      mode,
      semanticKey: label,
      children: list(text, 18),
      html: markup,
      structure: fieldsetLegendA11yPairCheckerOutputSchema,
    }),
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is Input =>
  matchesModelInput(input, inputSchema);
export const calculateFieldsetLegendStructureFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<Output> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    distinct(input.modes, "modes");
    work(input.count, input.fieldLabels.length + 2, "count", 128);
    const random = createGeneratorRandom(input.seed, context),
      cases = Array.from({ length: input.count }, () => {
        const mode = choose(input.modes, random),
          legend = "<legend>" + escape(input.legend) + "</legend>",
          inputs = input.fieldLabels.map(
            (l) => '<input aria-label="' + escape(l) + '">',
          ),
          content =
            mode === "first"
              ? [legend, ...inputs]
              : mode === "last"
                ? [...inputs, legend]
                : mode === "duplicate"
                  ? [legend, ...inputs, legend]
                  : inputs,
          children = content.map((s) =>
            s.startsWith("<legend>") ? "legend" : "input",
          ),
          core = calculateFieldsetLegendA11yPairChecker({ children });
        if (!core.ok) throw new Error("Constructed fieldset children rejected");
        return {
          mode,
          semanticKey: input.semanticKey,
          children,
          html: "<fieldset>" + content.join("") + "</fieldset>",
          structure: core.output,
        };
      });
    return toolSuccess(
      finish({ cases, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const fieldsetLegendStructureFixtureExample = {
  input: {
    legend: "Contact",
    fieldLabels: ["Email"],
    semanticKey: "contact-group",
    modes: ["first", "missing", "last", "duplicate"],
    count: 1,
    seed: 42,
  },
  output: {
    cases: [
      {
        mode: "last",
        semanticKey: "contact-group",
        children: ["input", "legend"],
        html: '<fieldset><input aria-label="Email"><legend>Contact</legend></fieldset>',
        structure: {
          legendCount: 1,
          legendFirst: false,
          validPlacement: false,
          hasLegend: true,
        },
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<Input, Output>;
export const fieldsetLegendStructureFixtureTool = createModelDefinition<
  Input,
  Output
>({
  id: "random/fieldset-legend-structure-fixture",
  title: "Random Fieldset Legend Structure Fixture Generator",
  description:
    "Construct supplied form-group content with first, missing, last or duplicate legends, preserving a caller semantic answer key and the structural core's optional-legend distinction.",
  inputSchema,
  outputSchema,
  execute: calculateFieldsetLegendStructureFixture,
});
export const runFieldsetLegendStructureFixture =
  fieldsetLegendStructureFixtureTool.execute;
export default fieldsetLegendStructureFixtureTool;
