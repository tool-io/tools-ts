import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly intrados: number;
  readonly extrados: number;
  readonly measurementOffset: number;
};
export type Output = {
  readonly nominalThickness: number;
  readonly correctedThickness: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    intrados: { type: "number", minimum: 0 },
    extrados: { type: "number" },
    measurementOffset: { type: "number" },
  },
  required: ["intrados", "extrados", "measurementOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominalThickness: { type: "number" },
    correctedThickness: { type: "number" },
  },
  required: ["nominalThickness", "correctedThickness"],
} as const;
/** Radial thickness between supplied concentric arch surfaces, with an explicit signed measurement correction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { intrados, extrados, measurementOffset } = request;
  const compute = (): Output => {
    H.domain(intrados >= 0 && extrados >= intrados);
    return {
      nominalThickness: extrados - intrados,
      correctedThickness: extrados - intrados - measurementOffset,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { intrados: 2, extrados: 2.5, measurementOffset: 0.1 },
  output: { nominalThickness: 0.5, correctedThickness: 0.4 },
} satisfies ToolExample<Input, Output>;
export const archIntradosExtradosRadiusGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "architecture/arch-intrados-extrados-radius-gap",
    title: "Arch Intrados Extrados Radius Gap Tool",
    description:
      "Radial thickness between supplied concentric arch surfaces, with an explicit signed measurement correction.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        intrados: { type: "number", minimum: 0 },
        extrados: { type: "number" },
        measurementOffset: { type: "number" },
      },
      required: ["intrados", "extrados", "measurementOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nominalThickness: { type: "number" },
        correctedThickness: { type: "number" },
      },
      required: ["nominalThickness", "correctedThickness"],
    },
    ports: {
      inputs: [
        {
          id: "intrados",
          label: "Intrados",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "extrados",
          label: "Extrados",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measurementOffset",
          label: "Measurement Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "nominalThickness",
          label: "Nominal Thickness",
          valueType: { type: "number" },
        },
        {
          id: "correctedThickness",
          label: "Corrected Thickness",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = archIntradosExtradosRadiusGapTool.execute;
export default archIntradosExtradosRadiusGapTool;
