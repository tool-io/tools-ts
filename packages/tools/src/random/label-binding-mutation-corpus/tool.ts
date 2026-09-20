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
  readonly fields: readonly { readonly id: string; readonly label: string }[];
  readonly modes: readonly ("matched" | "missing" | "wrong" | "duplicate")[];
  readonly count: number;
  readonly seed?: number;
};
export type Output = {
  readonly cases: readonly {
    readonly fieldId: string;
    readonly mode: "matched" | "missing" | "wrong" | "duplicate";
    readonly html: string;
    readonly parsed: readonly import("../../html/attribute-parser/tool.js").ParsedHtmlTag[];
    readonly binding: LabelForIdBindingCheckerOutput;
  }[];
  readonly randomness: GeneratorReplay;
};
const mode = enumeration(["matched", "missing", "wrong", "duplicate"]);
export const inputSchema = object(
  {
    fields: list(object({ id, label }), 16),
    modes: list(mode, 4),
    count: integer(1, 32),
    seed: generatorSeedSchema,
  },
  ["fields", "modes", "count"],
);
export const outputSchema = object({
  cases: list(
    object({
      fieldId: id,
      mode,
      html: markup,
      parsed: list(parsedSchema, 3),
      binding: labelForIdBindingCheckerOutputSchema,
    }),
  ),
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is Input =>
  matchesModelInput(input, inputSchema);
export const calculateLabelBindingMutationCorpus = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<Output> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    distinct(
      input.fields.map((f) => f.id),
      "fields",
    );
    distinct(input.modes, "modes");
    const random = createGeneratorRandom(input.seed, context),
      cases = Array.from({ length: input.count }, () => {
        const field = choose(input.fields, random),
          mode = choose(input.modes, random),
          forId = mode === "wrong" ? "missing-" + field.id : field.id,
          labelTag = '<label for="' + forId + '">',
          inputTag =
            mode === "missing" ? "<input>" : '<input id="' + field.id + '">',
          tags =
            mode === "duplicate"
              ? [labelTag, '<span id="' + field.id + '">', inputTag]
              : [labelTag, inputTag],
          parsed = tags.map(parse),
          elements = parsed
            .slice(1)
            .filter((t) => t.attributes.some((a) => a.name === "id")),
          ids = elements.map(
            (t) => t.attributes.find((a) => a.name === "id")?.value ?? "",
          );
        const core = calculateLabelForIdBindingChecker({
          hasFor: true,
          forId:
            parsed[0]?.attributes.find((a) => a.name === "for")?.value ?? "",
          elementIds: ids,
          labelable: elements.map((t) => t.name === "input"),
          implicitLabelableCount: 0,
        });
        if (!core.ok) throw new Error("Constructed label evidence rejected");
        const html =
          labelTag +
          escape(field.label) +
          "</label>" +
          (mode === "duplicate" ? tags[1] + "</span>" : "") +
          inputTag;
        return { fieldId: field.id, mode, html, parsed, binding: core.output };
      });
    return toolSuccess(
      finish({ cases, randomness: generatorReplay(input.seed, context) }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const labelBindingMutationCorpusExample = {
  input: {
    fields: [
      { id: "name", label: "Name" },
      { id: "email", label: "Email" },
    ],
    modes: ["matched", "missing", "wrong", "duplicate"],
    count: 1,
    seed: 42,
  },
  output: {
    cases: [
      {
        fieldId: "email",
        mode: "missing",
        html: '<label for="email">Email</label><input>',
        parsed: [
          { name: "label", attributes: [{ name: "for", value: "email" }] },
          { name: "input", attributes: [] },
        ],
        binding: { bound: false, targetIndex: -1, duplicateId: false },
      },
    ],
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<Input, Output>;
export const labelBindingMutationCorpusTool = createModelDefinition<
  Input,
  Output
>({
  id: "random/label-binding-mutation-corpus",
  title: "Random Label Binding Mutation Corpus Generator",
  description:
    "Construct supplied form-label markup with missing, wrong and nonlabelable duplicate-ID mutations, retaining lexical parsing and first-ID binding expectations without an accessibility verdict.",
  inputSchema,
  outputSchema,
  execute: calculateLabelBindingMutationCorpus,
});
export const runLabelBindingMutationCorpus =
  labelBindingMutationCorpusTool.execute;
export default labelBindingMutationCorpusTool;
