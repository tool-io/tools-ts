import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly title: string;
  readonly articles: readonly string[];
  readonly caseSensitive: boolean;
};
export type Output = { readonly sortKey: string; readonly article: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    title: { type: "string", maxLength: 8192 },
    articles: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    caseSensitive: { type: "boolean" },
  },
  required: ["title", "articles", "caseSensitive"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sortKey: { type: "string", maxLength: 8192 },
    article: { type: "string", maxLength: 8192 },
  },
  required: ["sortKey", "article"],
} as const;
/** Strip the longest caller-supplied initial article followed by one ASCII space; preserve remaining title spelling. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { title, articles, caseSensitive } = request;
  const compute = (): Output => {
    H.domain(articles.every((x) => x.length > 0));
    const normalized = caseSensitive ? title : title.toLowerCase();
    const matches = articles
      .filter((a) =>
        normalized.startsWith((caseSensitive ? a : a.toLowerCase()) + " "),
      )
      .sort((a, b) => b.length - a.length);
    const article = matches[0] ?? "";
    return {
      sortKey: article ? title.slice(article.length + 1) : title,
      article,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    title: "The Odyssey",
    articles: ["The", "A", "An"],
    caseSensitive: false,
  },
  output: { sortKey: "Odyssey", article: "The" },
} satisfies ToolExample<Input, Output>;
export const literaryTitleArticleSortRuleTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "comparative-literature/literary-title-article-sort-rule",
    title: "Literary Title Article Sort Rule Tool",
    description:
      "Strip the longest caller-supplied initial article followed by one ASCII space; preserve remaining title spelling.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        title: { type: "string", maxLength: 8192 },
        articles: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        caseSensitive: { type: "boolean" },
      },
      required: ["title", "articles", "caseSensitive"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sortKey: { type: "string", maxLength: 8192 },
        article: { type: "string", maxLength: 8192 },
      },
      required: ["sortKey", "article"],
    },
    ports: {
      inputs: [
        {
          id: "title",
          label: "Title",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "articles",
          label: "Articles",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "caseSensitive",
          label: "Case Sensitive",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "sortKey", label: "Sort Key", valueType: { type: "string" } },
        { id: "article", label: "Article", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = literaryTitleArticleSortRuleTool.execute;
export default literaryTitleArticleSortRuleTool;
