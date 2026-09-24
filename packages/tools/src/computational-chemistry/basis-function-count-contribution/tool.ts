import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly shellCounts: readonly number[];
  readonly functionsPerShell: readonly number[];
  readonly excludedFunctions: number;
};
export type Output = {
  readonly grossFunctions: number;
  readonly retainedFunctions: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shellCounts: { type: "array", maxItems: 256, items: { type: "integer" } },
    functionsPerShell: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    excludedFunctions: { type: "integer", minimum: 0 },
  },
  required: ["shellCounts", "functionsPerShell", "excludedFunctions"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossFunctions: { type: "integer" },
    retainedFunctions: { type: "integer" },
  },
  required: ["grossFunctions", "retainedFunctions"],
} as const;
/** Expand explicitly supplied shell/function counts without inventing a basis-set table. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { shellCounts, functionsPerShell, excludedFunctions } = request;
  const compute = (): Output => {
    H.sameLength(shellCounts, functionsPerShell);
    H.domain(
      shellCounts.every((x) => x >= 0) &&
        functionsPerShell.every((x) => x >= 0),
    );
    H.integer(excludedFunctions, 0);
    const total = shellCounts.reduce(
      (a, b, i) => a + BigInt(b) * BigInt(functionsPerShell[i]),
      0n,
    );
    H.domain(BigInt(excludedFunctions) <= total);
    return {
      grossFunctions: Number(total),
      retainedFunctions: Number(total - BigInt(excludedFunctions)),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    shellCounts: [2, 1],
    functionsPerShell: [1, 3],
    excludedFunctions: 1,
  },
  output: { grossFunctions: 5, retainedFunctions: 4 },
} satisfies ToolExample<Input, Output>;
export const basisFunctionCountContributionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-chemistry/basis-function-count-contribution",
    title: "Basis Function Count Contribution Tool",
    description:
      "Expand explicitly supplied shell/function counts without inventing a basis-set table.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shellCounts: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        functionsPerShell: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        excludedFunctions: { type: "integer", minimum: 0 },
      },
      required: ["shellCounts", "functionsPerShell", "excludedFunctions"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossFunctions: { type: "integer" },
        retainedFunctions: { type: "integer" },
      },
      required: ["grossFunctions", "retainedFunctions"],
    },
    ports: {
      inputs: [
        {
          id: "shellCounts",
          label: "Shell Counts",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "functionsPerShell",
          label: "Functions Per Shell",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "excludedFunctions",
          label: "Excluded Functions",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "grossFunctions",
          label: "Gross Functions",
          valueType: { type: "integer" },
        },
        {
          id: "retainedFunctions",
          label: "Retained Functions",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = basisFunctionCountContributionTool.execute;
export default basisFunctionCountContributionTool;
