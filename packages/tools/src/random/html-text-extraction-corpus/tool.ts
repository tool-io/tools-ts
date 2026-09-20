import type { ToolExample } from "../../core/example.js";
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
import type { ToolExecutionContext } from "../../core/definition.js";
import {
  createGeneratorRandom,
  generatorFailure,
  generatorReplay,
  generatorReplaySchema,
  generatorSeedSchema,
  type GeneratorReplay,
} from "../generator-random.js";
import { calculateTextExtractor } from "../../html/text-extractor/tool.js";
import { calculateTagStripper } from "../../html/tag-stripper/tool.js";
import { calculateCommentRemover } from "../../html/comment-remover/tool.js";
import { runEncodeHtmlEntities } from "../../encode/html-entities/tool.js";

export type HtmlTextFragmentKind =
  | "paragraph"
  | "span"
  | "emphasis"
  | "comment"
  | "inert-script"
  | "style-comment";
export type HtmlTextExtractionCorpusInput = {
  readonly texts: readonly string[];
  readonly kinds: readonly HtmlTextFragmentKind[];
  readonly caseCount: number;
  readonly fragmentsPerCase: number;
  readonly seed?: number;
};
export type HtmlTextExtractionCorpusOutput = {
  readonly cases: readonly {
    readonly fragments: readonly {
      readonly kind: HtmlTextFragmentKind;
      readonly text: string;
      readonly body: string;
      readonly source: string;
    }[];
    readonly html: string;
    readonly extractedText: string;
    readonly tagStrippedText: string;
    readonly commentsRemovedHtml: string;
  }[];
  readonly randomness: GeneratorReplay;
};
const kindSchema = {
  type: "string",
  enum: [
    "paragraph",
    "span",
    "emphasis",
    "comment",
    "inert-script",
    "style-comment",
  ],
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    texts: {
      type: "array",
      minItems: 1,
      maxItems: 16,
      items: { type: "string", maxLength: 64 },
    },
    kinds: { type: "array", minItems: 1, maxItems: 6, items: kindSchema },
    caseCount: { type: "integer", minimum: 1, maximum: 16 },
    fragmentsPerCase: { type: "integer", minimum: 1, maximum: 16 },
    seed: generatorSeedSchema,
  },
  required: ["texts", "kinds", "caseCount", "fragmentsPerCase"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cases: {
      type: "array",
      minItems: 1,
      maxItems: 16,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          fragments: {
            type: "array",
            minItems: 1,
            maxItems: 16,
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                kind: kindSchema,
                text: { type: "string", maxLength: 64 },
                body: { type: "string", maxLength: 400 },
                source: { type: "string", maxLength: 512 },
              },
              required: ["kind", "text", "body", "source"],
            },
          },
          html: { type: "string", minLength: 1, maxLength: 8192 },
          extractedText: { type: "string", maxLength: 8192 },
          tagStrippedText: { type: "string", maxLength: 8192 },
          commentsRemovedHtml: { type: "string", maxLength: 8192 },
        },
        required: [
          "fragments",
          "html",
          "extractedText",
          "tagStrippedText",
          "commentsRemovedHtml",
        ],
      },
    },
    randomness: generatorReplaySchema,
  },
  required: ["cases", "randomness"],
} as const;

const isInput = (input: unknown): input is HtmlTextExtractionCorpusInput =>
  matchesModelInput(input, inputSchema);
export const calculateHtmlTextExtractionCorpus = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<HtmlTextExtractionCorpusOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (new Set(input.kinds).size !== input.kinds.length)
      simpleError("kinds", "Entries must be distinct.", "duplicate_entries");
    if (input.texts.some((text) => /[\x00-\x08\x0b\x0e-\x1f\x7f]/.test(text)))
      simpleError(
        "texts",
        "Fixture text must not contain unsupported ASCII controls.",
        "invalid_fixture_text",
      );
    const encoded = input.texts.map((text) => {
      const result = runEncodeHtmlEntities({ text });
      if (!result.ok)
        throw new Error(
          "Bounded fixture text was rejected by the HTML entity encoder.",
        );
      return { text, body: result.output.encoded as string };
    });
    const random = createGeneratorRandom(input.seed, context);
    const cases = Array.from({ length: input.caseCount }, () => {
      const fragments = Array.from({ length: input.fragmentsPerCase }, () => {
        const kind = random.pick(input.kinds),
          value = random.pick(encoded);
        const body =
          kind === "style-comment"
            ? "/* " + value.body.replaceAll("*/", "*&#47;") + " */"
            : kind === "comment"
              ? value.body.replaceAll("--", "-&#45;")
              : value.body;
        const source =
          kind === "paragraph"
            ? "<p>" + body + "</p>"
            : kind === "span"
              ? "<span>" + body + "</span>"
              : kind === "emphasis"
                ? "<em>" + body + "</em>"
                : kind === "comment"
                  ? "<!-- " + body + " -->"
                  : kind === "inert-script"
                    ? '<script type="text/plain">' + body + "</script>"
                    : "<style>" + body + "</style>";
        return { kind, text: value.text, body, source };
      });
      const html = fragments.map((fragment) => fragment.source).join(""),
        extracted = calculateTextExtractor({ html }),
        stripped = calculateTagStripper({ html }),
        removed = calculateCommentRemover({ html });
      if (!extracted.ok || !stripped.ok || !removed.ok)
        throw new Error(
          "A generated bounded lexical fragment was rejected by an HTML core.",
        );
      const expectedText = fragments
        .filter((fragment) =>
          ["paragraph", "span", "emphasis"].includes(fragment.kind),
        )
        .map((fragment) => fragment.text)
        .join("");
      const expectedRaw = fragments
        .filter((fragment) => fragment.kind !== "comment")
        .map((fragment) => fragment.body)
        .join("");
      const expectedHtml = fragments
        .filter((fragment) => fragment.kind !== "comment")
        .map((fragment) => fragment.source)
        .join("");
      if (
        extracted.output.text !== expectedText ||
        stripped.output.text !== expectedRaw ||
        removed.output.html !== expectedHtml
      )
        throw new Error(
          "Generated fragment expectations disagreed with the declared lexical HTML core conventions.",
        );
      return {
        fragments,
        html,
        extractedText: extracted.output.text,
        tagStrippedText: stripped.output.text,
        commentsRemovedHtml: removed.output.html,
      };
    });
    return toolSuccess({
      cases,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const htmlTextExtractionCorpusExample = {
  input: {
    texts: ["A&B", "x<y"],
    kinds: ["paragraph", "comment", "inert-script", "span"],
    caseCount: 1,
    fragmentsPerCase: 4,
    seed: 42,
  },
  output: {
    cases: [
      {
        fragments: [
          {
            kind: "inert-script",
            text: "A&B",
            body: "A&amp;B",
            source: '<script type="text/plain">A&amp;B</script>',
          },
          {
            kind: "span",
            text: "x<y",
            body: "x&lt;y",
            source: "<span>x&lt;y</span>",
          },
          {
            kind: "paragraph",
            text: "x<y",
            body: "x&lt;y",
            source: "<p>x&lt;y</p>",
          },
          {
            kind: "comment",
            text: "x<y",
            body: "x&lt;y",
            source: "<!-- x&lt;y -->",
          },
        ],
        html: '<script type="text/plain">A&amp;B</script><span>x&lt;y</span><p>x&lt;y</p><!-- x&lt;y -->',
        extractedText: "x<yx<y",
        tagStrippedText: "A&amp;Bx&lt;yx&lt;y",
        commentsRemovedHtml:
          '<script type="text/plain">A&amp;B</script><span>x&lt;y</span><p>x&lt;y</p>',
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  HtmlTextExtractionCorpusInput,
  HtmlTextExtractionCorpusOutput
>;
export const htmlTextExtractionCorpusTool = createModelDefinition<
  HtmlTextExtractionCorpusInput,
  HtmlTextExtractionCorpusOutput
>({
  id: "random/html-text-extraction-corpus",
  title: "Random HTML Text Extraction Corpus Generator",
  description:
    "Compose bounded escaped paragraph/span/emphasis, comment, inert-script, and comment-only-style source from supplied text, then delegate text extraction, tag stripping, and comment removal separately; retain raw source and entity conventions without executing markup/scripts, browser layout equivalence, or sanitization claims.",
  inputSchema,
  outputSchema,
  execute: calculateHtmlTextExtractionCorpus,
});
export const runHtmlTextExtractionCorpus = htmlTextExtractionCorpusTool.execute;
export default htmlTextExtractionCorpusTool;
