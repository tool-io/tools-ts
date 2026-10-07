import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly n: number; readonly k: number };
export type Output = {
  readonly symmetricIndex: number;
  readonly reducedIndex: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    n: { type: "integer", minimum: 0 },
    k: { type: "integer", minimum: 0 },
  },
  required: ["n", "k"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    symmetricIndex: { type: "integer" },
    reducedIndex: { type: "integer" },
  },
  required: ["symmetricIndex", "reducedIndex"],
} as const;
/** Return n-k and min(k,n-k) for the explicit binomial symmetry identity without evaluating the coefficient. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { n, k } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(n) && n >= 0 && n <= Number.MAX_SAFE_INTEGER,
      "n",
    ),
      n);
    (H.domain(Number.isSafeInteger(k) && k >= 0 && k <= n, "k"), k);
    return { symmetricIndex: n - k, reducedIndex: Math.min(k, n - k) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { n: 10, k: 7 },
  output: { symmetricIndex: 3, reducedIndex: 3 },
} satisfies ToolExample<Input, Output>;
export const binomialCoefficientSymmetryIndexTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["combinatorics", "mathematics"],
      keywords: ["combinatorics", "mathematics"],
    },
    id: "combinatorics/binomial-coefficient-symmetry-index",
    title: "Binomial Coefficient Symmetry Index",
    description:
      "Return n-k and min(k,n-k) for the explicit binomial symmetry identity without evaluating the coefficient.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        n: { type: "integer", minimum: 0 },
        k: { type: "integer", minimum: 0 },
      },
      required: ["n", "k"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        symmetricIndex: { type: "integer" },
        reducedIndex: { type: "integer" },
      },
      required: ["symmetricIndex", "reducedIndex"],
    },
    ports: {
      inputs: [
        { id: "n", label: "N", required: true, valueType: { type: "integer" } },
        { id: "k", label: "K", required: true, valueType: { type: "integer" } },
      ],
      outputs: [
        {
          id: "symmetricIndex",
          label: "Symmetric Index",
          valueType: { type: "integer" },
        },
        {
          id: "reducedIndex",
          label: "Reduced Index",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = binomialCoefficientSymmetryIndexTool.execute;
export default binomialCoefficientSymmetryIndexTool;
