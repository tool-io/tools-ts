import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly referenceActivity: number;
  readonly elapsedTime: number;
  readonly suppliedDecayConstant: number;
};
export type Output = { readonly activityAtElapsedTime: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceActivity: { type: "number", minimum: 0 },
    elapsedTime: { type: "number" },
    suppliedDecayConstant: { type: "number", minimum: 0 },
  },
  required: ["referenceActivity", "elapsedTime", "suppliedDecayConstant"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { activityAtElapsedTime: { type: "number" } },
  required: ["activityAtElapsedTime"],
} as const;
/** Shift explicit reference isotope activity by signed elapsed time under a supplied first-order decay constant in matching time units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { referenceActivity, elapsedTime, suppliedDecayConstant } = request;
  const compute = (): Output => {
    H.domain(referenceActivity >= 0, "referenceActivity");
    H.domain(suppliedDecayConstant >= 0, "suppliedDecayConstant");
    return {
      activityAtElapsedTime:
        referenceActivity * Math.exp(-suppliedDecayConstant * elapsedTime),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { referenceActivity: 100, elapsedTime: 2, suppliedDecayConstant: 0.5 },
  output: { activityAtElapsedTime: 36.787944117144235 },
} satisfies ToolExample<Input, Output>;
export const isotopeActivityDecayReferenceDateTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "geochemistry/isotope-activity-decay-reference-date-term",
      title: "Isotope Activity Decay Reference Date Term Tool",
      description:
        "Shift explicit reference isotope activity by signed elapsed time under a supplied first-order decay constant in matching time units.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          referenceActivity: { type: "number", minimum: 0 },
          elapsedTime: { type: "number" },
          suppliedDecayConstant: { type: "number", minimum: 0 },
        },
        required: ["referenceActivity", "elapsedTime", "suppliedDecayConstant"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { activityAtElapsedTime: { type: "number" } },
        required: ["activityAtElapsedTime"],
      },
      ports: {
        inputs: [
          {
            id: "referenceActivity",
            label: "Reference Activity",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "elapsedTime",
            label: "Elapsed Time",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedDecayConstant",
            label: "Supplied Decay Constant",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "activityAtElapsedTime",
            label: "Activity At Elapsed Time",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = isotopeActivityDecayReferenceDateTermTool.execute;
export default isotopeActivityDecayReferenceDateTermTool;
