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

type Kind = "replacement" | "insertion" | "deletion" | "obsolete";
export type Input = {
  readonly fragments: readonly {
    readonly before: string;
    readonly after: string;
  }[];
  readonly kinds: readonly Kind[];
  readonly count: number;
  readonly seed?: number;
};
export type Output = {
  readonly ledger: readonly {
    readonly index: number;
    readonly kind: Kind;
    readonly suppliedBefore: string;
    readonly suppliedAfter: string;
    readonly before: string;
    readonly after: string;
    readonly markup: string;
    readonly tags: readonly import("../../html/attribute-parser/tool.js").ParsedHtmlTag[];
  }[];
  readonly beforeText: string;
  readonly afterText: string;
  readonly html: string;
  readonly randomness: GeneratorReplay;
};
const kind = enumeration(["replacement", "insertion", "deletion", "obsolete"]);
export const inputSchema = object(
  {
    fragments: list(object({ before: text, after: text })),
    kinds: list(kind, 4),
    count: integer(1, 32),
    seed: generatorSeedSchema,
  },
  ["fragments", "kinds", "count"],
);
export const outputSchema = object({
  ledger: list(
    object({
      index: integer(0, 31),
      kind,
      suppliedBefore: text,
      suppliedAfter: text,
      before: text,
      after: text,
      markup,
      tags: list(parsedSchema, 2),
    }),
  ),
  beforeText: { type: "string", maxLength: 8192 },
  afterText: { type: "string", maxLength: 8192 },
  html: markup,
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is Input =>
  matchesModelInput(input, inputSchema);
export const calculateSemanticEditMarkupFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<Output> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    distinct(input.kinds, "kinds");
    const random = createGeneratorRandom(input.seed, context),
      ledger = Array.from({ length: input.count }, (_, index) => {
        const fragment = choose(input.fragments, random),
          kind = choose(input.kinds, random),
          before = kind === "insertion" ? "" : fragment.before,
          after =
            kind === "deletion"
              ? ""
              : kind === "obsolete"
                ? fragment.before
                : fragment.after,
          annotations: { tag: "ins" | "del" | "s"; text: string }[] =
            kind === "replacement"
              ? [
                  { tag: "del", text: before },
                  { tag: "ins", text: after },
                ]
              : kind === "insertion"
                ? [{ tag: "ins", text: after }]
                : kind === "deletion"
                  ? [{ tag: "del", text: before }]
                  : [{ tag: "s", text: before }],
          start = (tag: string) => "<" + tag + ' data-edit="' + index + '">',
          tags = annotations.map((a) => parse(start(a.tag))),
          markup = annotations
            .map((a) => start(a.tag) + escape(a.text) + "</" + a.tag + ">")
            .join("");
        return {
          index,
          kind,
          suppliedBefore: fragment.before,
          suppliedAfter: fragment.after,
          before,
          after,
          markup,
          tags,
        };
      }),
      beforeText = ledger.map((e) => e.before).join(""),
      afterText = ledger.map((e) => e.after).join(""),
      html = ledger.map((e) => e.markup).join("");
    return toolSuccess(
      finish({
        ledger,
        beforeText,
        afterText,
        html,
        randomness: generatorReplay(input.seed, context),
      }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const semanticEditMarkupFixtureExample = {
  input: {
    fragments: [
      { before: "Old", after: "New" },
      { before: "Draft", after: "Final" },
    ],
    kinds: ["replacement", "insertion", "deletion", "obsolete"],
    count: 1,
    seed: 42,
  },
  output: {
    ledger: [
      {
        index: 0,
        kind: "insertion",
        suppliedBefore: "Draft",
        suppliedAfter: "Final",
        before: "",
        after: "Final",
        markup: '<ins data-edit="0">Final</ins>',
        tags: [
          { name: "ins", attributes: [{ name: "data-edit", value: "0" }] },
        ],
      },
    ],
    beforeText: "",
    afterText: "Final",
    html: '<ins data-edit="0">Final</ins>',
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<Input, Output>;
export const semanticEditMarkupFixtureTool = createModelDefinition<
  Input,
  Output
>({
  id: "random/semantic-edit-markup-fixture",
  title: "Random Semantic Edit Markup Fixture Generator",
  description:
    "Construct escaped caller edit fragments using ins/del/s annotations with an explicit before/after ledger and lexical tag keys, without assigning legal meaning.",
  inputSchema,
  outputSchema,
  execute: calculateSemanticEditMarkupFixture,
});
export const runSemanticEditMarkupFixture =
  semanticEditMarkupFixtureTool.execute;
export default semanticEditMarkupFixtureTool;
