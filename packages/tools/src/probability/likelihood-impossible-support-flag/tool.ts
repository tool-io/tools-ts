import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly suppliedLikelihood: number;
  readonly insideSuppliedSupport: boolean;
};
export type Output = {
  readonly zeroLikelihood: boolean;
  readonly supportContradiction: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    suppliedLikelihood: { type: "number", minimum: 0 },
    insideSuppliedSupport: { type: "boolean" },
  },
  required: ["suppliedLikelihood", "insideSuppliedSupport"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    zeroLikelihood: { type: "boolean" },
    supportContradiction: { type: "boolean" },
  },
  required: ["zeroLikelihood", "supportContradiction"],
} as const;
/** Compare explicit likelihood magnitude and supplied support membership without treating a density as a bounded probability. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { suppliedLikelihood, insideSuppliedSupport } = request;
  const compute = (): Output => {
    H.domain(suppliedLikelihood >= 0, "suppliedLikelihood");
    return {
      zeroLikelihood: suppliedLikelihood === 0,
      supportContradiction: !insideSuppliedSupport && suppliedLikelihood !== 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { suppliedLikelihood: 0, insideSuppliedSupport: false },
  output: { zeroLikelihood: true, supportContradiction: false },
} satisfies ToolExample<Input, Output>;
export const likelihoodImpossibleSupportFlagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["probability", "mathematics"],
      keywords: ["probability", "mathematics"],
    },
    id: "probability/likelihood-impossible-support-flag",
    title: "Likelihood Impossible Support Flag",
    description:
      "Compare explicit likelihood magnitude and supplied support membership without treating a density as a bounded probability.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        suppliedLikelihood: { type: "number", minimum: 0 },
        insideSuppliedSupport: { type: "boolean" },
      },
      required: ["suppliedLikelihood", "insideSuppliedSupport"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        zeroLikelihood: { type: "boolean" },
        supportContradiction: { type: "boolean" },
      },
      required: ["zeroLikelihood", "supportContradiction"],
    },
    ports: {
      inputs: [
        {
          id: "suppliedLikelihood",
          label: "Supplied Likelihood",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "insideSuppliedSupport",
          label: "Inside Supplied Support",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "zeroLikelihood",
          label: "Zero Likelihood",
          valueType: { type: "boolean" },
        },
        {
          id: "supportContradiction",
          label: "Support Contradiction",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = likelihoodImpossibleSupportFlagTool.execute;
export default likelihoodImpossibleSupportFlagTool;
