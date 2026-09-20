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

export type Input = {
  readonly tags: readonly string[];
  readonly texts: readonly string[];
  readonly nodeCount: number;
  readonly seed?: number;
};
export type Output = {
  readonly nodes: readonly {
    readonly id: string;
    readonly parentId: string | null;
    readonly text: string;
    readonly explicitLanguage: string | null;
    readonly effectiveLanguage: string;
    readonly parsed: import("../../html/attribute-parser/tool.js").ParsedHtmlTag;
  }[];
  readonly html: string;
  readonly randomness: GeneratorReplay;
};
const language = {
  type: "string",
  minLength: 2,
  maxLength: 63,
  pattern: "^[A-Za-z]{2,8}(?:-[A-Za-z0-9]{1,8})*(?![\\s\\S])",
} as const;
export const inputSchema = object(
  {
    tags: list(language, 16),
    texts: list(text, 16),
    nodeCount: integer(1, 16),
    seed: generatorSeedSchema,
  },
  ["tags", "texts", "nodeCount"],
);
export const outputSchema = object({
  nodes: list(
    object({
      id,
      parentId: nullable(id),
      text,
      explicitLanguage: nullable(language),
      effectiveLanguage: language,
      parsed: parsedSchema,
    }),
    16,
  ),
  html: markup,
  randomness: generatorReplaySchema,
});
const isInput = (input: unknown): input is Input =>
  matchesModelInput(input, inputSchema);
export const calculateLanguageAttributeNestingFixture = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<Output> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    distinct(input.tags, "tags");
    const random = createGeneratorRandom(input.seed, context),
      nodes: {
        id: string;
        parentId: string | null;
        text: string;
        explicitLanguage: string | null;
        effectiveLanguage: string;
        parsed: import("../../html/attribute-parser/tool.js").ParsedHtmlTag;
        depth: number;
      }[] = [];
    for (let i = 0; i < input.nodeCount; i++) {
      const parent =
          i === 0
            ? null
            : choose(
                nodes.filter((n) => n.depth < 8),
                random,
              ),
        explicitLanguage =
          parent === null || random.unit() < 0.5
            ? choose(input.tags, random)
            : null,
        effectiveLanguage = explicitLanguage ?? parent?.effectiveLanguage;
      if (effectiveLanguage === undefined)
        throw new Error("Missing root language");
      const text = choose(input.texts, random),
        start =
          '<span id="language-' +
          i +
          '"' +
          (explicitLanguage === null
            ? ""
            : ' lang="' + explicitLanguage + '"') +
          ">";
      nodes.push({
        id: "language-" + i,
        parentId: parent?.id ?? null,
        text,
        explicitLanguage,
        effectiveLanguage,
        parsed: parse(start),
        depth: parent === null ? 0 : parent.depth + 1,
      });
    }
    const render = (node: (typeof nodes)[number]): string =>
        '<span id="' +
        node.id +
        '"' +
        (node.explicitLanguage === null
          ? ""
          : ' lang="' + node.explicitLanguage + '"') +
        ">" +
        escape(node.text) +
        nodes
          .filter((n) => n.parentId === node.id)
          .map(render)
          .join("") +
        "</span>",
      root = nodes[0];
    if (!root) throw new Error("Missing language root");
    return toolSuccess(
      finish({
        nodes: nodes.map(({ depth, ...n }) => n),
        html: render(root),
        randomness: generatorReplay(input.seed, context),
      }),
    );
  } catch (error) {
    return generatorFailure(error);
  }
};
export const languageAttributeNestingFixtureExample = {
  input: {
    tags: ["en", "fr"],
    texts: ["Bonjour", "Salut"],
    nodeCount: 2,
    seed: 42,
  },
  output: {
    nodes: [
      {
        id: "language-0",
        parentId: null,
        text: "Bonjour",
        explicitLanguage: "fr",
        effectiveLanguage: "fr",
        parsed: {
          name: "span",
          attributes: [
            { name: "id", value: "language-0" },
            { name: "lang", value: "fr" },
          ],
        },
      },
      {
        id: "language-1",
        parentId: "language-0",
        text: "Bonjour",
        explicitLanguage: null,
        effectiveLanguage: "fr",
        parsed: {
          name: "span",
          attributes: [{ name: "id", value: "language-1" }],
        },
      },
    ],
    html: '<span id="language-0" lang="fr">Bonjour<span id="language-1">Bonjour</span></span>',
    randomness: { seed: 42, source: "seed" },
  },
} satisfies ToolExample<Input, Output>;
export const languageAttributeNestingFixtureTool = createModelDefinition<
  Input,
  Output
>({
  id: "random/language-attribute-nesting-fixture",
  title: "Random Language Attribute Nesting Fixture Generator",
  description:
    "Construct nested text regions from caller-reviewed language tags with explicit inheritance and override keys; lexical tag-shape acceptance does not validate language-registry membership.",
  inputSchema,
  outputSchema,
  execute: calculateLanguageAttributeNestingFixture,
});
export const runLanguageAttributeNestingFixture =
  languageAttributeNestingFixtureTool.execute;
export default languageAttributeNestingFixtureTool;
