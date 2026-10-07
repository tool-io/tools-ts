import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly authorCount: number;
  readonly workWeight: number;
};
export type Output = { readonly creditPerAuthor: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    authorCount: { type: "integer", minimum: 1 },
    workWeight: { type: "number", minimum: 0 },
  },
  required: ["authorCount", "workWeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { creditPerAuthor: { type: "number" } },
  required: ["creditPerAuthor"],
} as const;
/** Split an explicitly weighted publication equally among its recorded author count without inferring contributions. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { authorCount, workWeight } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(authorCount) &&
        authorCount >= 1 &&
        authorCount <= Number.MAX_SAFE_INTEGER,
      "authorCount",
    ),
      authorCount);
    H.domain(workWeight >= 0, "workWeight");
    return { creditPerAuthor: workWeight / authorCount };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { authorCount: 4, workWeight: 1 },
  output: { creditPerAuthor: 0.25 },
} satisfies ToolExample<Input, Output>;
export const authorCountFractionalCreditTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: ["bibliometrics", "research and quality management"],
      keywords: ["bibliometrics", "research and quality management"],
    },
    id: "bibliometrics/author-count-fractional-credit",
    title: "Author Count Fractional Credit",
    description:
      "Split an explicitly weighted publication equally among its recorded author count without inferring contributions.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        authorCount: { type: "integer", minimum: 1 },
        workWeight: { type: "number", minimum: 0 },
      },
      required: ["authorCount", "workWeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { creditPerAuthor: { type: "number" } },
      required: ["creditPerAuthor"],
    },
    ports: {
      inputs: [
        {
          id: "authorCount",
          label: "Author Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "workWeight",
          label: "Work Weight",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "creditPerAuthor",
          label: "Credit Per Author",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = authorCountFractionalCreditTool.execute;
export default authorCountFractionalCreditTool;
