import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly flow: number; readonly contactDuration: number };
export type Output = { readonly equivalentVolume: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    flow: { type: "number", minimum: 0 },
    contactDuration: { type: "number", minimum: 0 },
  },
  required: ["flow", "contactDuration"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { equivalentVolume: { type: "number" } },
  required: ["equivalentVolume"],
} as const;
/** Multiply explicit recirculation flow and contact time without system or animal-health recommendations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { flow, contactDuration } = request;
  const compute = (): Output => {
    H.domain(flow >= 0 && contactDuration >= 0);
    return { equivalentVolume: flow * contactDuration };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { flow: 2, contactDuration: 3 },
  output: { equivalentVolume: 6 },
} satisfies ToolExample<Input, Output>;
export const recirculationContactVolumeFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquaponics/recirculation-contact-volume-factor",
    title: "Recirculation Contact Volume Factor Tool",
    description:
      "Multiply explicit recirculation flow and contact time without system or animal-health recommendations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        flow: { type: "number", minimum: 0 },
        contactDuration: { type: "number", minimum: 0 },
      },
      required: ["flow", "contactDuration"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { equivalentVolume: { type: "number" } },
      required: ["equivalentVolume"],
    },
    ports: {
      inputs: [
        {
          id: "flow",
          label: "Flow",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "contactDuration",
          label: "Contact Duration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "equivalentVolume",
          label: "Equivalent Volume",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = recirculationContactVolumeFactorTool.execute;
export default recirculationContactVolumeFactorTool;
