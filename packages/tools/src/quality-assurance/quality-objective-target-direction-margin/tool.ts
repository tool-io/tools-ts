import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observed: number;
  readonly target: number;
  readonly higherIsBetter: boolean;
  readonly tolerance: number;
};
export type Output = {
  readonly orientedMargin: number;
  readonly meets: boolean;
  readonly withinTolerance: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observed: { type: "number" },
    target: { type: "number" },
    higherIsBetter: { type: "boolean" },
    tolerance: { type: "number", minimum: 0 },
  },
  required: ["observed", "target", "higherIsBetter", "tolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    orientedMargin: { type: "number" },
    meets: { type: "boolean" },
    withinTolerance: { type: "boolean" },
  },
  required: ["orientedMargin", "meets", "withinTolerance"],
} as const;
/** Direction-aware distance from a supplied quality objective. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observed, target, higherIsBetter, tolerance } = request;
  const compute = (): Output => {
    H.domain(tolerance >= 0);
    return {
      orientedMargin: (higherIsBetter ? 1 : -1) * (observed - target),
      meets: higherIsBetter ? observed >= target : observed <= target,
      withinTolerance: Math.abs(observed - target) <= tolerance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observed: 90, target: 95, higherIsBetter: true, tolerance: 3 },
  output: { orientedMargin: -5, meets: false, withinTolerance: false },
} satisfies ToolExample<Input, Output>;
export const qualityObjectiveTargetDirectionMarginTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "quality-assurance/quality-objective-target-direction-margin",
      title: "Quality Objective Target Direction Margin Tool",
      description:
        "Direction-aware distance from a supplied quality objective.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          observed: { type: "number" },
          target: { type: "number" },
          higherIsBetter: { type: "boolean" },
          tolerance: { type: "number", minimum: 0 },
        },
        required: ["observed", "target", "higherIsBetter", "tolerance"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          orientedMargin: { type: "number" },
          meets: { type: "boolean" },
          withinTolerance: { type: "boolean" },
        },
        required: ["orientedMargin", "meets", "withinTolerance"],
      },
      ports: {
        inputs: [
          {
            id: "observed",
            label: "Observed",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "target",
            label: "Target",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "higherIsBetter",
            label: "Higher Is Better",
            required: true,
            valueType: { type: "boolean" },
          },
          {
            id: "tolerance",
            label: "Tolerance",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "orientedMargin",
            label: "Oriented Margin",
            valueType: { type: "number" },
          },
          { id: "meets", label: "Meets", valueType: { type: "boolean" } },
          {
            id: "withinTolerance",
            label: "Within Tolerance",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = qualityObjectiveTargetDirectionMarginTool.execute;
export default qualityObjectiveTargetDirectionMarginTool;
