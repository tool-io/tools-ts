import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly probabilities: readonly number[];
  readonly threshold: number;
};
export type Output = {
  readonly boundaryIndex: number;
  readonly massBefore: number;
  readonly massThrough: number;
  readonly excess: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    probabilities: { type: "array", maxItems: 256, items: { type: "number" } },
    threshold: { type: "number" },
  },
  required: ["probabilities", "threshold"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    boundaryIndex: { type: "integer" },
    massBefore: { type: "number" },
    massThrough: { type: "number" },
    excess: { type: "number" },
  },
  required: ["boundaryIndex", "massBefore", "massThrough", "excess"],
} as const;
/** Find the smallest descending-probability nucleus reaching a supplied top-p threshold, including its boundary token. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { probabilities, threshold } = request;
  const compute = (): Output => {
    H.domain(
      probabilities.length > 0 &&
        probabilities.every(
          (x, i) => x >= 0 && x <= 1 && (i === 0 || x <= probabilities[i - 1]),
        ) &&
        Math.abs(probabilities.reduce((a, b) => a + b, 0) - 1) <= 1e-12 &&
        threshold > 0 &&
        threshold <= 1,
    );
    let massBefore = 0;
    for (let i = 0; i < probabilities.length; i++) {
      const massThrough = massBefore + probabilities[i];
      if (massThrough >= threshold || i === probabilities.length - 1)
        return {
          boundaryIndex: i,
          massBefore,
          massThrough,
          excess: massThrough - threshold,
        };
      massBefore = massThrough;
    }
    throw new Error("Unreachable nonempty distribution");
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { probabilities: [0.5, 0.3, 0.2], threshold: 0.7 },
  output: {
    boundaryIndex: 1,
    massBefore: 0.5,
    massThrough: 0.8,
    excess: 0.10000000000000009,
  },
} satisfies ToolExample<Input, Output>;
export const topPBoundaryTokenResidualMassTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "artificial-intelligence/top-p-boundary-token-residual-mass",
    title: "Top P Boundary Token Residual Mass Tool",
    description:
      "Find the smallest descending-probability nucleus reaching a supplied top-p threshold, including its boundary token.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        probabilities: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        threshold: { type: "number" },
      },
      required: ["probabilities", "threshold"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        boundaryIndex: { type: "integer" },
        massBefore: { type: "number" },
        massThrough: { type: "number" },
        excess: { type: "number" },
      },
      required: ["boundaryIndex", "massBefore", "massThrough", "excess"],
    },
    ports: {
      inputs: [
        {
          id: "probabilities",
          label: "Probabilities",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "threshold",
          label: "Threshold",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "boundaryIndex",
          label: "Boundary Index",
          valueType: { type: "integer" },
        },
        {
          id: "massBefore",
          label: "Mass Before",
          valueType: { type: "number" },
        },
        {
          id: "massThrough",
          label: "Mass Through",
          valueType: { type: "number" },
        },
        { id: "excess", label: "Excess", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = topPBoundaryTokenResidualMassTool.execute;
export default topPBoundaryTokenResidualMassTool;
