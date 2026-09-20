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
import { calculateAttributeParser } from "../../html/attribute-parser/tool.js";
import { runEncodeHtmlEntities } from "../../encode/html-entities/tool.js";

export type HtmlCorpusQuoteStyle = "double" | "single" | "unquoted" | "boolean";
export type HtmlAttributeQuotingCorpusInput = {
  readonly tagNames: readonly (
    "div" | "span" | "input" | "button" | "a" | "p"
  )[];
  readonly attributeNames: readonly string[];
  readonly values: readonly string[];
  readonly styles: readonly HtmlCorpusQuoteStyle[];
  readonly caseCount: number;
  readonly attributesPerTag: number;
  readonly seed?: number;
};
export type HtmlAttributeQuotingCorpusOutput = {
  readonly cases: readonly {
    readonly tag: string;
    readonly sourceAttributes: readonly {
      readonly name: string;
      readonly inputValue: string;
      readonly encodedValue: string;
      readonly style: HtmlCorpusQuoteStyle;
    }[];
    readonly parsed: {
      readonly name: string;
      readonly attributes: readonly {
        readonly name: string;
        readonly value: string;
      }[];
    };
  }[];
  readonly randomness: GeneratorReplay;
};
const styleSchema = {
  type: "string",
  enum: ["double", "single", "unquoted", "boolean"],
} as const;
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    tagNames: {
      type: "array",
      minItems: 1,
      maxItems: 6,
      items: {
        type: "string",
        enum: ["div", "span", "input", "button", "a", "p"],
      },
    },
    attributeNames: {
      type: "array",
      minItems: 1,
      maxItems: 16,
      items: {
        type: "string",
        minLength: 1,
        maxLength: 32,
        pattern: "^[A-Za-z][A-Za-z0-9_-]*(?![\\s\\S])",
      },
    },
    values: {
      type: "array",
      minItems: 1,
      maxItems: 16,
      items: { type: "string", maxLength: 64 },
    },
    styles: { type: "array", minItems: 1, maxItems: 4, items: styleSchema },
    caseCount: { type: "integer", minimum: 1, maximum: 32 },
    attributesPerTag: { type: "integer", minimum: 0, maximum: 8 },
    seed: generatorSeedSchema,
  },
  required: [
    "tagNames",
    "attributeNames",
    "values",
    "styles",
    "caseCount",
    "attributesPerTag",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cases: {
      type: "array",
      minItems: 1,
      maxItems: 32,
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          tag: { type: "string", minLength: 3, maxLength: 4096 },
          sourceAttributes: {
            type: "array",
            maxItems: 8,
            items: {
              type: "object",
              additionalProperties: false,
              properties: {
                name: { type: "string", minLength: 1, maxLength: 32 },
                inputValue: { type: "string", maxLength: 64 },
                encodedValue: { type: "string", maxLength: 384 },
                style: styleSchema,
              },
              required: ["name", "inputValue", "encodedValue", "style"],
            },
          },
          parsed: {
            type: "object",
            additionalProperties: false,
            properties: {
              name: { type: "string", minLength: 1, maxLength: 6 },
              attributes: {
                type: "array",
                maxItems: 8,
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    name: { type: "string", minLength: 1, maxLength: 32 },
                    value: { type: "string", maxLength: 384 },
                  },
                  required: ["name", "value"],
                },
              },
            },
            required: ["name", "attributes"],
          },
        },
        required: ["tag", "sourceAttributes", "parsed"],
      },
    },
    randomness: generatorReplaySchema,
  },
  required: ["cases", "randomness"],
} as const;

const isInput = (input: unknown): input is HtmlAttributeQuotingCorpusInput =>
  matchesModelInput(input, inputSchema);
export const calculateHtmlAttributeQuotingCorpus = (
  input: unknown,
  context?: ToolExecutionContext,
): ToolResult<HtmlAttributeQuotingCorpusOutput> => {
  if (!isInput(input))
    return invalidInput(modelInputIssues(input, inputSchema));
  try {
    if (new Set(input.tagNames).size !== input.tagNames.length)
      simpleError("tagNames", "Entries must be distinct.", "duplicate_entries");
    if (new Set(input.attributeNames).size !== input.attributeNames.length)
      simpleError(
        "attributeNames",
        "Entries must be distinct.",
        "duplicate_entries",
      );
    if (new Set(input.styles).size !== input.styles.length)
      simpleError("styles", "Entries must be distinct.", "duplicate_entries");
    for (const name of input.attributeNames) {
      const lower = name.toLowerCase();
      if (
        !["id", "class", "title", "lang", "dir", "disabled", "value"].includes(
          lower,
        ) &&
        !lower.startsWith("data-") &&
        !lower.startsWith("aria-")
      )
        simpleError(
          "attributeNames",
          "Use benign lexical attributes: id/class/title/lang/dir/disabled/value or data-/aria- names.",
          "unsupported_attribute_name",
        );
    }
    const values = input.values.map((inputValue) => {
      if (/[\x00-\x1f\x7f]/.test(inputValue))
        simpleError(
          "values",
          "Attribute fixture text must not contain ASCII controls.",
          "invalid_fixture_text",
        );
      const result = runEncodeHtmlEntities({ text: inputValue });
      if (!result.ok)
        throw new Error(
          "Bounded plain text was rejected by the HTML entity encoder.",
        );
      const encodedValue = result.output.encoded as string;
      const styles = input.styles.filter((style) =>
        style === "boolean"
          ? encodedValue === ""
          : style === "unquoted"
            ? encodedValue !== "" && !/[\s\x60=]/.test(encodedValue)
            : true,
      );
      if (!styles.length)
        simpleError(
          "styles",
          "Every supplied value needs at least one feasible selected quote style.",
          "infeasible_quoting",
        );
      return { inputValue, encodedValue, styles };
    });
    const random = createGeneratorRandom(input.seed, context);
    const cases = Array.from({ length: input.caseCount }, () => {
      const name = random.pick(input.tagNames),
        sourceAttributes = Array.from(
          { length: input.attributesPerTag },
          () => {
            const name = random.pick(input.attributeNames),
              selected = random.pick(values),
              style = random.pick(selected.styles);
            return {
              name,
              inputValue: selected.inputValue,
              encodedValue: selected.encodedValue,
              style,
            };
          },
        );
      const attributes = sourceAttributes.map((attribute) => {
        if (attribute.style === "boolean") return attribute.name;
        const value =
          attribute.style === "double"
            ? '"' + attribute.encodedValue + '"'
            : attribute.style === "single"
              ? "'" + attribute.encodedValue + "'"
              : attribute.encodedValue;
        return attribute.name + "=" + value;
      });
      const tag =
          "<" +
          name +
          (attributes.length ? " " + attributes.join(" ") : "") +
          ">",
        result = calculateAttributeParser({ tag });
      if (!result.ok)
        throw new Error(
          "A supported generated start tag was rejected by the lexical parser.",
        );
      const seen = new Set<string>(),
        expected = sourceAttributes.flatMap((attribute) => {
          const lower = attribute.name.toLowerCase();
          if (seen.has(lower)) return [];
          seen.add(lower);
          return [{ name: lower, value: attribute.encodedValue }];
        });
      if (
        result.output.name !== name ||
        result.output.attributes.length !== expected.length ||
        result.output.attributes.some(
          (attribute, i) =>
            attribute.name !== expected[i].name ||
            attribute.value !== expected[i].value,
        )
      )
        throw new Error(
          "Generated lexical attribute expectations disagreed with the parser.",
        );
      return { tag, sourceAttributes, parsed: result.output };
    });
    return toolSuccess({
      cases,
      randomness: generatorReplay(input.seed, context),
    });
  } catch (error) {
    return generatorFailure(error);
  }
};
export const htmlAttributeQuotingCorpusExample = {
  input: {
    tagNames: ["div", "input"],
    attributeNames: ["TITLE", "data-id"],
    values: ["A&B", 'x"y'],
    styles: ["double", "single", "unquoted"],
    caseCount: 2,
    attributesPerTag: 2,
    seed: 42,
  },
  output: {
    cases: [
      {
        tag: '<input TITLE=x&quot;y TITLE="x&quot;y">',
        sourceAttributes: [
          {
            name: "TITLE",
            inputValue: 'x"y',
            encodedValue: "x&quot;y",
            style: "unquoted",
          },
          {
            name: "TITLE",
            inputValue: 'x"y',
            encodedValue: "x&quot;y",
            style: "double",
          },
        ],
        parsed: {
          name: "input",
          attributes: [
            {
              name: "title",
              value: "x&quot;y",
            },
          ],
        },
      },
      {
        tag: '<input data-id="A&amp;B" data-id="x&quot;y">',
        sourceAttributes: [
          {
            name: "data-id",
            inputValue: "A&B",
            encodedValue: "A&amp;B",
            style: "double",
          },
          {
            name: "data-id",
            inputValue: 'x"y',
            encodedValue: "x&quot;y",
            style: "double",
          },
        ],
        parsed: {
          name: "input",
          attributes: [
            {
              name: "data-id",
              value: "A&amp;B",
            },
          ],
        },
      },
    ],
    randomness: {
      seed: 42,
      source: "seed",
    },
  },
} satisfies ToolExample<
  HtmlAttributeQuotingCorpusInput,
  HtmlAttributeQuotingCorpusOutput
>;
export const htmlAttributeQuotingCorpusTool = createModelDefinition<
  HtmlAttributeQuotingCorpusInput,
  HtmlAttributeQuotingCorpusOutput
>({
  id: "random/html-attribute-quoting-corpus",
  title: "Random HTML Attribute Quoting Corpus Generator",
  description:
    "Compose bounded benign start-tag source with caller text, delegated five-character entity escaping, feasible double/single/unquoted/Boolean attribute forms, and duplicate attributes; retain the lexical parser's raw character references and first-duplicate rule, not DOM-decoded values, sanitization, or HTML conformance certification.",
  inputSchema,
  outputSchema,
  execute: calculateHtmlAttributeQuotingCorpus,
});
export const runHtmlAttributeQuotingCorpus =
  htmlAttributeQuotingCorpusTool.execute;
export default htmlAttributeQuotingCorpusTool;
