import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly length: number;
  readonly posture: string;
  readonly referencePosture: string;
  readonly correction: number;
  readonly apply: boolean;
};
export type Output = {
  readonly matches: boolean;
  readonly comparisonLength: number;
  readonly applied: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "number" },
    posture: { type: "string", maxLength: 8192 },
    referencePosture: { type: "string", maxLength: 8192 },
    correction: { type: "number" },
    apply: { type: "boolean" },
  },
  required: ["length", "posture", "referencePosture", "correction", "apply"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    matches: { type: "boolean" },
    comparisonLength: { type: "number" },
    applied: { type: "boolean" },
  },
  required: ["matches", "comparisonLength", "applied"],
} as const;
/** Retain posture and apply only an explicit requested correction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { length, posture, referencePosture, correction, apply } = request;
  const compute = (): Output => {
    H.domain(length >= 0, "length");
    H.domain(posture.length > 0 && referencePosture.length > 0, "posture");
    const applied = posture !== referencePosture && apply;
    return {
      matches: posture === referencePosture,
      comparisonLength: length + (applied ? correction : 0),
      applied,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    length: 50,
    posture: "recumbent",
    referencePosture: "standing",
    correction: -0.5,
    apply: true,
  },
  output: { matches: false, comparisonLength: 49.5, applied: true },
} satisfies ToolExample<Input, Output>;
export const infantResearchLengthPostureTagTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "neonatology/infant-research-length-posture-tag",
    title: "Infant Research Length Posture Tag Tool",
    description:
      "Retain posture and apply only an explicit requested correction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        length: { type: "number" },
        posture: { type: "string", maxLength: 8192 },
        referencePosture: { type: "string", maxLength: 8192 },
        correction: { type: "number" },
        apply: { type: "boolean" },
      },
      required: [
        "length",
        "posture",
        "referencePosture",
        "correction",
        "apply",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        matches: { type: "boolean" },
        comparisonLength: { type: "number" },
        applied: { type: "boolean" },
      },
      required: ["matches", "comparisonLength", "applied"],
    },
    ports: {
      inputs: [
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "posture",
          label: "Posture",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "referencePosture",
          label: "Reference Posture",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "correction",
          label: "Correction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "apply",
          label: "Apply",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "matches", label: "Matches", valueType: { type: "boolean" } },
        {
          id: "comparisonLength",
          label: "Comparison Length",
          valueType: { type: "number" },
        },
        { id: "applied", label: "Applied", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = infantResearchLengthPostureTagTool.execute;
export default infantResearchLengthPostureTagTool;
