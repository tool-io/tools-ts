import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly articleNumber: string;
  readonly firstPage: string;
  readonly lastPage: string;
  readonly kind: string;
};
export type Output = { readonly locator: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    articleNumber: { type: "string", maxLength: 8192 },
    firstPage: { type: "string", maxLength: 8192 },
    lastPage: { type: "string", maxLength: 8192 },
    kind: { type: "string", maxLength: 8192, enum: ["article", "pages"] },
  },
  required: ["articleNumber", "firstPage", "lastPage", "kind"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { locator: { type: "string", maxLength: 8192 } },
  required: ["locator"],
} as const;
/** Format an explicit article-number or page-range locator without guessing from its spelling. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { articleNumber, firstPage, lastPage, kind } = request;
  const compute = (): Output => {
    H.domain(["article", "pages"].includes(kind));
    H.domain(
      kind === "article"
        ? articleNumber.length > 0
        : firstPage.length > 0 && lastPage.length > 0,
    );
    return {
      locator:
        kind === "article"
          ? articleNumber
          : firstPage === lastPage
            ? firstPage
            : firstPage + "–" + lastPage,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    articleNumber: "e0042",
    firstPage: "",
    lastPage: "",
    kind: "article",
  },
  output: { locator: "e0042" },
} satisfies ToolExample<Input, Output>;
export const articleNumberVersusPageLocatorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bibliometrics/article-number-versus-page-locator",
    title: "Article Number Versus Page Locator Tool",
    description:
      "Format an explicit article-number or page-range locator without guessing from its spelling.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        articleNumber: { type: "string", maxLength: 8192 },
        firstPage: { type: "string", maxLength: 8192 },
        lastPage: { type: "string", maxLength: 8192 },
        kind: { type: "string", maxLength: 8192, enum: ["article", "pages"] },
      },
      required: ["articleNumber", "firstPage", "lastPage", "kind"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { locator: { type: "string", maxLength: 8192 } },
      required: ["locator"],
    },
    ports: {
      inputs: [
        {
          id: "articleNumber",
          label: "Article Number",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "firstPage",
          label: "First Page",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "lastPage",
          label: "Last Page",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "kind",
          label: "Kind",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "locator", label: "Locator", valueType: { type: "string" } },
      ],
    },
  },
  calculate,
});
export const run = articleNumberVersusPageLocatorTool.execute;
export default articleNumberVersusPageLocatorTool;
