import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly strutVolume: number;
  readonly totalEnvelopeVolume: number;
};
export type Output = { readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    strutVolume: { type: "number", minimum: 0 },
    totalEnvelopeVolume: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["strutVolume", "totalEnvelopeVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" } },
  required: ["share"],
} as const;
/** Calculate scaffold strut volume share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { strutVolume, totalEnvelopeVolume } = request;
  const compute = (): Output => {
    H.positive(totalEnvelopeVolume);
    H.domain(strutVolume >= 0 && strutVolume <= totalEnvelopeVolume);
    return { share: strutVolume / totalEnvelopeVolume };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { strutVolume: 2, totalEnvelopeVolume: 10 },
  output: { share: 0.2 },
} satisfies ToolExample<Input, Output>;
export const scaffoldStrutVolumeShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioengineering/scaffold-strut-volume-share",
    title: "Scaffold Strut Volume Share Tool",
    description:
      "Calculate scaffold strut volume share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        strutVolume: { type: "number", minimum: 0 },
        totalEnvelopeVolume: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["strutVolume", "totalEnvelopeVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" } },
      required: ["share"],
    },
    ports: {
      inputs: [
        {
          id: "strutVolume",
          label: "Strut Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalEnvelopeVolume",
          label: "Total Envelope Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "share", label: "Share", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = scaffoldStrutVolumeShareTool.execute;
export default scaffoldStrutVolumeShareTool;
