import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recordedPotential: number;
  readonly suppliedJunctionOffset: number;
};
export type Output = { readonly correctedPotential: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recordedPotential: { type: "number" },
    suppliedJunctionOffset: { type: "number" },
  },
  required: ["recordedPotential", "suppliedJunctionOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { correctedPotential: { type: "number" } },
  required: ["correctedPotential"],
} as const;
/** Subtract an explicit additive liquid-junction offset from recorded electrode potential under the supplied sign convention. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recordedPotential, suppliedJunctionOffset } = request;
  const compute = (): Output => {
    return { correctedPotential: recordedPotential - suppliedJunctionOffset };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { recordedPotential: 0.25, suppliedJunctionOffset: 0.02 },
  output: { correctedPotential: 0.23 },
} satisfies ToolExample<Input, Output>;
export const electrodePotentialLiquidJunctionOffsetTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "electrochemistry/electrode-potential-liquid-junction-offset",
      title: "Electrode Potential Liquid Junction Offset Tool",
      description:
        "Subtract an explicit additive liquid-junction offset from recorded electrode potential under the supplied sign convention.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          recordedPotential: { type: "number" },
          suppliedJunctionOffset: { type: "number" },
        },
        required: ["recordedPotential", "suppliedJunctionOffset"],
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
            id: "recordedPotential",
            label: "Recorded Potential",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedJunctionOffset",
            label: "Supplied Junction Offset",
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
export const run = electrodePotentialLiquidJunctionOffsetTool.execute;
export default electrodePotentialLiquidJunctionOffsetTool;
