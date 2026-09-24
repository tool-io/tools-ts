import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rawForce: number;
  readonly zeroReference: number;
  readonly referenceUncertainty: number;
};
export type Output = {
  readonly correctedForce: number;
  readonly lower: number;
  readonly upper: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rawForce: { type: "number" },
    zeroReference: { type: "number" },
    referenceUncertainty: { type: "number", minimum: 0 },
  },
  required: ["rawForce", "zeroReference", "referenceUncertainty"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    correctedForce: { type: "number" },
    lower: { type: "number" },
    upper: { type: "number" },
  },
  required: ["correctedForce", "lower", "upper"],
} as const;
/** Calculate atomic force zero reference gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rawForce, zeroReference, referenceUncertainty } = request;
  const compute = (): Output => {
    H.domain(referenceUncertainty >= 0);
    return {
      correctedForce: rawForce - zeroReference,
      lower: rawForce - zeroReference - referenceUncertainty,
      upper: rawForce - zeroReference + referenceUncertainty,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rawForce: 5, zeroReference: 2, referenceUncertainty: 0.5 },
  output: { correctedForce: 3, lower: 2.5, upper: 3.5 },
} satisfies ToolExample<Input, Output>;
export const atomicForceZeroReferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-chemistry/atomic-force-zero-reference-gap",
    title: "Atomic Force Zero Reference Gap Tool",
    description:
      "Calculate atomic force zero reference gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rawForce: { type: "number" },
        zeroReference: { type: "number" },
        referenceUncertainty: { type: "number", minimum: 0 },
      },
      required: ["rawForce", "zeroReference", "referenceUncertainty"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        correctedForce: { type: "number" },
        lower: { type: "number" },
        upper: { type: "number" },
      },
      required: ["correctedForce", "lower", "upper"],
    },
    ports: {
      inputs: [
        {
          id: "rawForce",
          label: "Raw Force",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "zeroReference",
          label: "Zero Reference",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceUncertainty",
          label: "Reference Uncertainty",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correctedForce",
          label: "Corrected Force",
          valueType: { type: "number" },
        },
        { id: "lower", label: "Lower", valueType: { type: "number" } },
        { id: "upper", label: "Upper", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = atomicForceZeroReferenceGapTool.execute;
export default atomicForceZeroReferenceGapTool;
