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
  calculateLabelForIdBindingChecker,
  labelForIdBindingCheckerOutputSchema,
  type LabelForIdBindingCheckerOutput,
} from "../../html/label-for-id-binding-checker/tool.js";

export type Input = {
  readonly titles: readonly string[];
  readonly descriptions: readonly string[];
  readonly modes: readonly (
    "valid" | "missing-title" | "missing-description" | "duplicate-title"
  )[];
  readonly count: number;
  readonly seed?: number;
};
export type Output = {
  readonly cases: readonly {
    readonly mode:
      "valid" | "missing-title" | "missing-description" | "duplicate-title";
    readonly html: string;
    readonly parsed: import("../../html/attribute-parser/tool.js").ParsedHtmlTag;
    readonly titleReference: LabelForIdBindingCheckerOutput;
    readonly descriptionReference: LabelForIdBindingCheckerOutput;
  }[];
  readonly randomness: GeneratorReplay;
};
const mode = enumeration([
  "valid",
  "missing-title",
  "missing-description",
  "duplicate-title",
]);
export const inputSchema = object(
  {
    titles: list(label),
    descriptions: list(text),
    modes: list(mode, 4),
    count: integer(1, 32),
    seed: generatorSeedSchema,
  },
  ["titles", "descriptions", "modes", "count"],
);
export const outputSchema = object({
  cases: list(
    object({
      mode,
      html: markup,
      parsed: parsedSchema,
      titleReference: labelForIdBindingCheckerOutputSchema,
      descriptionReference: labelForIdBindingCheckerOutputSchema,
    }),
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is Input =>
  matchesModelInput(input, inputSchema);
export const calculateDialogLabelingFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<Output> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    distinct(input.modes, "modes");
    const random = createGeneratorRandom(input.seed, context),
      cases = Array.from({ length: input.count }, () => {
        const title = choose(input.titles, random),
          description = choose(input.descriptions, random),
          mode = choose(input.modes, random),
          elements: { id: string; tag: string; text: string }[] = [];
        if (mode !== "missing-title")
          elements.push({ id: "title", tag: "h2", text: title });
        if (mode === "duplicate-title")
          elements.push({ id: "title", tag: "p", text: title });
        if (mode !== "missing-description")
          elements.push({ id: "description", tag: "p", text: description });
        const start =
            '<dialog aria-labelledby="title" aria-describedby="description">',
          parsed = parse(start),
          resolve = (reference: string) => {
            const core = calculateLabelForIdBindingChecker({
              hasFor: true,
              forId: reference,
              elementIds: elements.map((e) => e.id),
              labelable: elements.map(() => true),
              implicitLabelableCount: 0,
            });
            if (!core.ok) throw new Error("Dialog reference evidence rejected");
            return core.output;
          };
        // Labelability flags are intentionally true: reuse only the core's first-ID resolver.
        return {
          mode,
          html:
            start +
            elements
              .map(
                (e) =>
                  "<" +
                  e.tag +
                  ' id="' +
                  e.id +
                  '">' +
                  escape(e.text) +
                  "</" +
                  e.tag +
                  ">",
              )
              .join("") +
            "</dialog>",
          parsed,
          titleReference: resolve("title"),
          descriptionReference: resolve("description"),
        };
      });
    return toolSuccess(
      finish({ cases, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const dialogLabelingFixtureExample = {
  input: {
    titles: ["Settings", "Help"],
    descriptions: ["Choose options"],
    modes: ["valid", "missing-title", "missing-description", "duplicate-title"],
    count: 1,
    seed: 42,
  },
  output: {
    cases: [
      {
        mode: "duplicate-title",
        html: '<dialog aria-labelledby="title" aria-describedby="description"><h2 id="title">Help</h2><p id="title">Help</p><p id="description">Choose options</p></dialog>',
        parsed: {
          name: "dialog",
          attributes: [
            { name: "aria-labelledby", value: "title" },
            { name: "aria-describedby", value: "description" },
          ],
        },
        titleReference: { bound: true, targetIndex: 0, duplicateId: true },
        descriptionReference: {
          bound: true,
          targetIndex: 2,
          duplicateId: false,
        },
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<Input, Output>;
export const dialogLabelingFixtureTool = createModelDefinition<Input, Output>({
  id: "random/dialog-labeling-fixture",
  title: "Random Dialog Labeling Fixture Generator",
  description:
    "Construct supplied dialog title/description ID references with missing and duplicate controls, reporting explicit first-ID resolution and raw attributes without focus-trap or accessible-name guarantees.",
  inputSchema,
  outputSchema,
  execute: calculateDialogLabelingFixture,
});
export const runDialogLabelingFixture = dialogLabelingFixtureTool.execute;
export default dialogLabelingFixtureTool;
