import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly intersection: number; readonly union: number };
export type Output = { readonly derivative: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    intersection: { type: "number", minimum: 0 },
    union: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["intersection", "union"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { derivative: { type: "number" } },
  required: ["derivative"],
} as const;
/** Calculate jaccard single false positive sensitivity from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { intersection, union } = request;
  const compute = (): Output => {
    H.domain(intersection >= 0 && union > 0 && intersection <= union);
    return { derivative: -intersection / (union * union) };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { intersection: 3, union: 5 },
  output: { derivative: -0.12 },
} satisfies ToolExample<Input, Output>;
export const jaccardSingleFalsePositiveSensitivityTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "similarity/jaccard-single-false-positive-sensitivity",
      title: "Jaccard Single False Positive Sensitivity Tool",
      description:
        "Calculate jaccard single false positive sensitivity from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          intersection: { type: "number", minimum: 0 },
          union: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["intersection", "union"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { derivative: { type: "number" } },
        required: ["derivative"],
      },
      ports: {
        inputs: [
          {
            id: "intersection",
            label: "Intersection",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "union",
            label: "Union",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "derivative",
            label: "Derivative",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = jaccardSingleFalsePositiveSensitivityTool.execute;
export default jaccardSingleFalsePositiveSensitivityTool;
