import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly costs: readonly number[];
  readonly includedByPerspective: readonly boolean[];
  readonly sourceVerified: readonly boolean[];
};
export type Output = {
  readonly includedCost: number;
  readonly verifiedIncludedCost: number;
  readonly unsupportedIncludedCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    costs: { type: "array", maxItems: 256, items: { type: "number" } },
    includedByPerspective: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
    sourceVerified: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: ["costs", "includedByPerspective", "sourceVerified"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    includedCost: { type: "number" },
    verifiedIncludedCost: { type: "number" },
    unsupportedIncludedCost: { type: "number" },
  },
  required: ["includedCost", "verifiedIncludedCost", "unsupportedIncludedCost"],
} as const;
/** Account for explicit signed costs under supplied perspective and provenance flags; no perspective or price is chosen. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { costs, includedByPerspective, sourceVerified } = request;
  const compute = (): Output => {
    H.sameLength(costs, includedByPerspective);
    H.sameLength(costs, sourceVerified);
    return (() => {
      const includedCost = costs.reduce(
          (s, x, i) => s + (includedByPerspective[i] ? x : 0),
          0,
        ),
        verifiedIncludedCost = costs.reduce(
          (s, x, i) =>
            s + (includedByPerspective[i] && sourceVerified[i] ? x : 0),
          0,
        );
      return {
        includedCost,
        verifiedIncludedCost,
        unsupportedIncludedCost: includedCost - verifiedIncludedCost,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    costs: [10, 20, 30],
    includedByPerspective: [true, true, false],
    sourceVerified: [true, false, true],
  },
  output: {
    includedCost: 30,
    verifiedIncludedCost: 10,
    unsupportedIncludedCost: 20,
  },
} satisfies ToolExample<Input, Output>;
export const costPerspectiveSourceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "health-economics/cost-perspective-source-gap",
    title: "Cost Perspective Source Gap Tool",
    description:
      "Account for explicit signed costs under supplied perspective and provenance flags; no perspective or price is chosen.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        costs: { type: "array", maxItems: 256, items: { type: "number" } },
        includedByPerspective: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
        sourceVerified: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["costs", "includedByPerspective", "sourceVerified"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        includedCost: { type: "number" },
        verifiedIncludedCost: { type: "number" },
        unsupportedIncludedCost: { type: "number" },
      },
      required: [
        "includedCost",
        "verifiedIncludedCost",
        "unsupportedIncludedCost",
      ],
    },
    ports: {
      inputs: [
        {
          id: "costs",
          label: "Costs",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "includedByPerspective",
          label: "Included By Perspective",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "sourceVerified",
          label: "Source Verified",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "includedCost",
          label: "Included Cost",
          valueType: { type: "number" },
        },
        {
          id: "verifiedIncludedCost",
          label: "Verified Included Cost",
          valueType: { type: "number" },
        },
        {
          id: "unsupportedIncludedCost",
          label: "Unsupported Included Cost",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = costPerspectiveSourceGapTool.execute;
export default costPerspectiveSourceGapTool;
