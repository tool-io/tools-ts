import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly headOneBased: number;
  readonly tokenCount: number;
};
export type Output = { readonly root: boolean; readonly headZeroBased: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    headOneBased: { type: "integer", minimum: 0 },
    tokenCount: { type: "integer", minimum: 0 },
  },
  required: ["headOneBased", "tokenCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { root: { type: "boolean" }, headZeroBased: { type: "integer" } },
  required: ["root", "headZeroBased"],
} as const;
/** Map a dependency head index with root=0 into a zero-based token index with root=-1, without validating an entire dependency tree. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { headOneBased, tokenCount } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(tokenCount) &&
        tokenCount >= 0 &&
        tokenCount <= Number.MAX_SAFE_INTEGER,
      "tokenCount",
    ),
      tokenCount);
    (H.domain(
      Number.isSafeInteger(headOneBased) &&
        headOneBased >= 0 &&
        headOneBased <= tokenCount,
      "headOneBased",
    ),
      headOneBased);
    return {
      root: headOneBased === 0,
      headZeroBased: headOneBased === 0 ? -1 : headOneBased - 1,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { headOneBased: 3, tokenCount: 5 },
  output: { root: false, headZeroBased: 2 },
} satisfies ToolExample<Input, Output>;
export const dependencyOneBasedHeadCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: [
        "computational-linguistics",
        "computational linguistics",
        "information and language sciences",
      ],
      keywords: [
        "computational linguistics",
        "information and language sciences",
      ],
    },
    id: "computational-linguistics/dependency-one-based-head-crosswalk",
    title: "Dependency One Based Head Crosswalk",
    description:
      "Map a dependency head index with root=0 into a zero-based token index with root=-1, without validating an entire dependency tree.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        headOneBased: { type: "integer", minimum: 0 },
        tokenCount: { type: "integer", minimum: 0 },
      },
      required: ["headOneBased", "tokenCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        root: { type: "boolean" },
        headZeroBased: { type: "integer" },
      },
      required: ["root", "headZeroBased"],
    },
    ports: {
      inputs: [
        {
          id: "headOneBased",
          label: "Head One Based",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "tokenCount",
          label: "Token Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "root", label: "Root", valueType: { type: "boolean" } },
        {
          id: "headZeroBased",
          label: "Head Zero Based",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = dependencyOneBasedHeadCrosswalkTool.execute;
export default dependencyOneBasedHeadCrosswalkTool;
