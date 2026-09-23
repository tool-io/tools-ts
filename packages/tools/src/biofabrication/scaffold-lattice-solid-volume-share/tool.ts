import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly strutVolume: number;
  readonly intersections: number;
  readonly envelopeVolume: number;
};
export type Output = {
  readonly solidVolume: number;
  readonly voidShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    strutVolume: { type: "number" },
    intersections: { type: "number", minimum: 0 },
    envelopeVolume: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["strutVolume", "intersections", "envelopeVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    solidVolume: { type: "number" },
    voidShare: { type: "number" },
  },
  required: ["solidVolume", "voidShare"],
} as const;
/** Calculate scaffold lattice solid volume share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { strutVolume, intersections, envelopeVolume } = request;
  const compute = (): Output => {
    H.positive(envelopeVolume);
    H.domain(
      intersections >= 0 &&
        strutVolume >= intersections &&
        strutVolume - intersections <= envelopeVolume,
    );
    return {
      solidVolume: strutVolume - intersections,
      voidShare: 1 - (strutVolume - intersections) / envelopeVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { strutVolume: 40, intersections: 5, envelopeVolume: 100 },
  output: { solidVolume: 35, voidShare: 0.65 },
} satisfies ToolExample<Input, Output>;
export const scaffoldLatticeSolidVolumeShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biofabrication/scaffold-lattice-solid-volume-share",
    title: "Scaffold Lattice Solid Volume Share Tool",
    description:
      "Calculate scaffold lattice solid volume share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        strutVolume: { type: "number" },
        intersections: { type: "number", minimum: 0 },
        envelopeVolume: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["strutVolume", "intersections", "envelopeVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        solidVolume: { type: "number" },
        voidShare: { type: "number" },
      },
      required: ["solidVolume", "voidShare"],
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
          id: "intersections",
          label: "Intersections",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "envelopeVolume",
          label: "Envelope Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "solidVolume",
          label: "Solid Volume",
          valueType: { type: "number" },
        },
        {
          id: "voidShare",
          label: "Void Share",
          valueType: { type: "number", unit: "1" },
        },
      ],
    },
  },
  calculate,
});
export const run = scaffoldLatticeSolidVolumeShareTool.execute;
export default scaffoldLatticeSolidVolumeShareTool;
