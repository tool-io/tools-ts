import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly degrees: readonly number[] };
export type Output = {
  readonly leafCount: number;
  readonly totalTwoMinusDegree: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    degrees: { type: "array", maxItems: 256, items: { type: "integer" } },
  },
  required: ["degrees"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    leafCount: { type: "integer" },
    totalTwoMinusDegree: { type: "integer" },
  },
  required: ["leafCount", "totalTwoMinusDegree"],
} as const;
/** Sum explicit vertex degree deficits 2-degree and count degree-one vertices without certifying that the graph is a tree. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { degrees } = request;
  const compute = (): Output => {
    return (() => {
      degrees.forEach(
        (degree) => (
          H.domain(
            Number.isSafeInteger(degree) &&
              degree >= 0 &&
              degree <= Number.MAX_SAFE_INTEGER,
            "degrees",
          ),
          degree
        ),
      );
      return {
        leafCount: degrees.filter((degree) => degree === 1).length,
        totalTwoMinusDegree: Number(
          degrees.reduce((total, degree) => total + 2n - BigInt(degree), 0n),
        ),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { degrees: [1, 2, 1] },
  output: { leafCount: 2, totalTwoMinusDegree: 2 },
} satisfies ToolExample<Input, Output>;
export const treeLeafDegreeDeficitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["graph", "mathematics"],
      keywords: ["graph", "mathematics"],
    },
    id: "graph/tree-leaf-degree-deficit",
    title: "Tree Leaf Degree Deficit",
    description:
      "Sum explicit vertex degree deficits 2-degree and count degree-one vertices without certifying that the graph is a tree.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        degrees: { type: "array", maxItems: 256, items: { type: "integer" } },
      },
      required: ["degrees"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        leafCount: { type: "integer" },
        totalTwoMinusDegree: { type: "integer" },
      },
      required: ["leafCount", "totalTwoMinusDegree"],
    },
    ports: {
      inputs: [
        {
          id: "degrees",
          label: "Degrees",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
      outputs: [
        {
          id: "leafCount",
          label: "Leaf Count",
          valueType: { type: "integer" },
        },
        {
          id: "totalTwoMinusDegree",
          label: "Total Two Minus Degree",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = treeLeafDegreeDeficitTool.execute;
export default treeLeafDegreeDeficitTool;
