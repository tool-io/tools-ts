import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredPotential: number;
  readonly referenceDrift: number;
  readonly referenceToTarget: number;
};
export type Output = { readonly correctedPotential: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredPotential: { type: "number" },
    referenceDrift: { type: "number" },
    referenceToTarget: { type: "number" },
  },
  required: ["measuredPotential", "referenceDrift", "referenceToTarget"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { correctedPotential: { type: "number" } },
  required: ["correctedPotential"],
} as const;
/** Apply explicit reference drift and reference-system offset with documented subtraction/addition signs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredPotential, referenceDrift, referenceToTarget } = request;
  const compute = (): Output => {
    return {
      correctedPotential:
        measuredPotential - referenceDrift + referenceToTarget,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    measuredPotential: 0.5,
    referenceDrift: 0.02,
    referenceToTarget: 0.1,
  },
  output: { correctedPotential: 0.58 },
} satisfies ToolExample<Input, Output>;
export const electrodeReferenceDriftSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electrochemistry/electrode-reference-drift-sign",
    title: "Electrode Reference Drift Sign Tool",
    description:
      "Apply explicit reference drift and reference-system offset with documented subtraction/addition signs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredPotential: { type: "number" },
        referenceDrift: { type: "number" },
        referenceToTarget: { type: "number" },
      },
      required: ["measuredPotential", "referenceDrift", "referenceToTarget"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { correctedPotential: { type: "number" } },
      required: ["correctedPotential"],
    },
    ports: {
      inputs: [
        {
          id: "measuredPotential",
          label: "Measured Potential",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceDrift",
          label: "Reference Drift",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceToTarget",
          label: "Reference To Target",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "correctedPotential",
          label: "Corrected Potential",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = electrodeReferenceDriftSignTool.execute;
export default electrodeReferenceDriftSignTool;
