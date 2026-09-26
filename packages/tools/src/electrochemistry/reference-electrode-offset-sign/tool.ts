import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredPotential: number;
  readonly suppliedReferencePotential: number;
};
export type Output = { readonly difference: number; readonly sign: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredPotential: { type: "number" },
    suppliedReferencePotential: { type: "number" },
  },
  required: ["measuredPotential", "suppliedReferencePotential"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { difference: { type: "number" }, sign: { type: "integer" } },
  required: ["difference", "sign"],
} as const;
/** Return the explicit measured-minus-reference potential and sign; no reference electrode standard potential is supplied. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredPotential, suppliedReferencePotential } = request;
  const compute = (): Output => {
    return {
      difference: measuredPotential - suppliedReferencePotential,
      sign: Math.sign(measuredPotential - suppliedReferencePotential),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { measuredPotential: 0.2, suppliedReferencePotential: 0.1 },
  output: { difference: 0.1, sign: 1 },
} satisfies ToolExample<Input, Output>;
export const referenceElectrodeOffsetSignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electrochemistry/reference-electrode-offset-sign",
    title: "Reference Electrode Offset Sign Tool",
    description:
      "Return the explicit measured-minus-reference potential and sign; no reference electrode standard potential is supplied.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredPotential: { type: "number" },
        suppliedReferencePotential: { type: "number" },
      },
      required: ["measuredPotential", "suppliedReferencePotential"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { difference: { type: "number" }, sign: { type: "integer" } },
      required: ["difference", "sign"],
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
          id: "suppliedReferencePotential",
          label: "Supplied Reference Potential",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "difference",
          label: "Difference",
          valueType: { type: "number" },
        },
        { id: "sign", label: "Sign", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = referenceElectrodeOffsetSignTool.execute;
export default referenceElectrodeOffsetSignTool;
