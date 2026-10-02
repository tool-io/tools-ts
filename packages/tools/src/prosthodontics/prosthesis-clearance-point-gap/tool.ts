import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstPoint: readonly number[];
  readonly secondPoint: readonly number[];
  readonly requiredClearance: number;
};
export type Output = { readonly distance: number; readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstPoint: { type: "array", maxItems: 256, items: { type: "number" } },
    secondPoint: { type: "array", maxItems: 256, items: { type: "number" } },
    requiredClearance: { type: "number", minimum: 0 },
  },
  required: ["firstPoint", "secondPoint", "requiredClearance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { distance: { type: "number" }, residual: { type: "number" } },
  required: ["distance", "residual"],
} as const;
/** Compare explicit research point separation with a supplied geometric allowance without clinical design guidance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstPoint, secondPoint, requiredClearance } = request;
  const compute = (): Output => {
    H.sameLength(firstPoint, secondPoint);
    H.domain(
      firstPoint.length >= 2 &&
        firstPoint.length <= 3 &&
        requiredClearance >= 0,
    );
    return {
      distance: Math.hypot(...firstPoint.map((x, i) => x - secondPoint[i])),
      residual:
        Math.hypot(...firstPoint.map((x, i) => x - secondPoint[i])) -
        requiredClearance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstPoint: [0, 0, 0],
    secondPoint: [3, 4, 0],
    requiredClearance: 4,
  },
  output: { distance: 5, residual: 1 },
} satisfies ToolExample<Input, Output>;
export const prosthesisClearancePointGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "prosthodontics/prosthesis-clearance-point-gap",
    title: "Prosthesis Clearance Point Gap Tool",
    description:
      "Compare explicit research point separation with a supplied geometric allowance without clinical design guidance.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstPoint: { type: "array", maxItems: 256, items: { type: "number" } },
        secondPoint: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        requiredClearance: { type: "number", minimum: 0 },
      },
      required: ["firstPoint", "secondPoint", "requiredClearance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        distance: { type: "number" },
        residual: { type: "number" },
      },
      required: ["distance", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "firstPoint",
          label: "First Point",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "secondPoint",
          label: "Second Point",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "requiredClearance",
          label: "Required Clearance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "distance", label: "Distance", valueType: { type: "number" } },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = prosthesisClearancePointGapTool.execute;
export default prosthesisClearancePointGapTool;
