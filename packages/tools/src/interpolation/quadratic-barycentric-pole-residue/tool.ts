import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly nodes: readonly number[];
  readonly values: readonly number[];
  readonly poleIndex: number;
};
export type Output = {
  readonly denominatorResidue: number;
  readonly numeratorResidue: number;
  readonly removableLimit: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nodes: { type: "array", maxItems: 256, items: { type: "number" } },
    values: { type: "array", maxItems: 256, items: { type: "number" } },
    poleIndex: { type: "integer", minimum: 0, maximum: 2 },
  },
  required: ["nodes", "values", "poleIndex"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    denominatorResidue: { type: "number" },
    numeratorResidue: { type: "number" },
    removableLimit: { type: "number" },
  },
  required: ["denominatorResidue", "numeratorResidue", "removableLimit"],
} as const;
/** Residues of the numerator and denominator barycentric sums at one of three distinct interpolation nodes. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { nodes, values, poleIndex } = request;
  const compute = (): Output => {
    H.domain(
      nodes.length === 3 && values.length === 3 && new Set(nodes).size === 3,
    );
    H.integer(poleIndex, 0, 2);
    const j = (poleIndex + 1) % 3,
      k = (poleIndex + 2) % 3,
      w = 1 / ((nodes[poleIndex] - nodes[j]) * (nodes[poleIndex] - nodes[k]));
    return {
      denominatorResidue: w,
      numeratorResidue: w * values[poleIndex],
      removableLimit: values[poleIndex],
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { nodes: [0, 1, 2], values: [2, 3, 6], poleIndex: 1 },
  output: { denominatorResidue: -1, numeratorResidue: -3, removableLimit: 3 },
} satisfies ToolExample<Input, Output>;
export const quadraticBarycentricPoleResidueTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "interpolation/quadratic-barycentric-pole-residue",
    title: "Quadratic Barycentric Pole Residue Tool",
    description:
      "Residues of the numerator and denominator barycentric sums at one of three distinct interpolation nodes.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nodes: { type: "array", maxItems: 256, items: { type: "number" } },
        values: { type: "array", maxItems: 256, items: { type: "number" } },
        poleIndex: { type: "integer", minimum: 0, maximum: 2 },
      },
      required: ["nodes", "values", "poleIndex"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        denominatorResidue: { type: "number" },
        numeratorResidue: { type: "number" },
        removableLimit: { type: "number" },
      },
      required: ["denominatorResidue", "numeratorResidue", "removableLimit"],
    },
    ports: {
      inputs: [
        {
          id: "nodes",
          label: "Nodes",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "values",
          label: "Values",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "poleIndex",
          label: "Pole Index",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "denominatorResidue",
          label: "Denominator Residue",
          valueType: { type: "number" },
        },
        {
          id: "numeratorResidue",
          label: "Numerator Residue",
          valueType: { type: "number" },
        },
        {
          id: "removableLimit",
          label: "Removable Limit",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = quadraticBarycentricPoleResidueTool.execute;
export default quadraticBarycentricPoleResidueTool;
