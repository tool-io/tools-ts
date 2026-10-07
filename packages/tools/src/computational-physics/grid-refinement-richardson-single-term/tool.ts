import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coarseValue: number;
  readonly fineValue: number;
  readonly refinementRatio: number;
  readonly convergenceOrder: number;
};
export type Output = {
  readonly estimatedFineError: number;
  readonly extrapolatedValue: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coarseValue: { type: "number" },
    fineValue: { type: "number" },
    refinementRatio: { type: "number", exclusiveMinimum: 1 },
    convergenceOrder: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["coarseValue", "fineValue", "refinementRatio", "convergenceOrder"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    estimatedFineError: { type: "number" },
    extrapolatedValue: { type: "number" },
  },
  required: ["estimatedFineError", "extrapolatedValue"],
} as const;
/** Calculate one Richardson fine-grid error and extrapolation under an explicit asymptotic h^p model and positive supplied order. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coarseValue, fineValue, refinementRatio, convergenceOrder } = request;
  const compute = (): Output => {
    H.domain(refinementRatio > 1, "refinementRatio");
    (H.domain(
      Number.isFinite(convergenceOrder) && convergenceOrder > 0,
      "convergenceOrder",
    ),
      convergenceOrder);
    return (() => {
      const denominator = Math.expm1(
        convergenceOrder * Math.log(refinementRatio),
      );
      H.domain(
        denominator > 0 && Number.isFinite(denominator),
        "convergenceOrder",
      );
      const correction = (fineValue - coarseValue) / denominator;
      return {
        estimatedFineError: -correction,
        extrapolatedValue: fineValue + correction,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    coarseValue: 2,
    fineValue: 1.25,
    refinementRatio: 2,
    convergenceOrder: 2,
  },
  output: { estimatedFineError: 0.25, extrapolatedValue: 1 },
} satisfies ToolExample<Input, Output>;
export const gridRefinementRichardsonSingleTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["computational-physics", "computational physics", "physics"],
      keywords: ["computational physics", "physics"],
    },
    id: "computational-physics/grid-refinement-richardson-single-term",
    title: "Grid Refinement Richardson Single Term",
    description:
      "Calculate one Richardson fine-grid error and extrapolation under an explicit asymptotic h^p model and positive supplied order.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coarseValue: { type: "number" },
        fineValue: { type: "number" },
        refinementRatio: { type: "number", exclusiveMinimum: 1 },
        convergenceOrder: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "coarseValue",
        "fineValue",
        "refinementRatio",
        "convergenceOrder",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        estimatedFineError: { type: "number" },
        extrapolatedValue: { type: "number" },
      },
      required: ["estimatedFineError", "extrapolatedValue"],
    },
    ports: {
      inputs: [
        {
          id: "coarseValue",
          label: "Coarse Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fineValue",
          label: "Fine Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "refinementRatio",
          label: "Refinement Ratio",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "convergenceOrder",
          label: "Convergence Order",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "estimatedFineError",
          label: "Estimated Fine Error",
          valueType: { type: "number" },
        },
        {
          id: "extrapolatedValue",
          label: "Extrapolated Value",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = gridRefinementRichardsonSingleTermTool.execute;
export default gridRefinementRichardsonSingleTermTool;
