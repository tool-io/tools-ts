import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly anodicPeak: number;
  readonly cathodicPeak: number;
  readonly referenceSeparation: number;
};
export type Output = {
  readonly separation: number;
  readonly midpoint: number;
  readonly referenceGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    anodicPeak: { type: "number" },
    cathodicPeak: { type: "number" },
    referenceSeparation: { type: "number", minimum: 0 },
  },
  required: ["anodicPeak", "cathodicPeak", "referenceSeparation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    separation: { type: "number" },
    midpoint: { type: "number" },
    referenceGap: { type: "number" },
  },
  required: ["separation", "midpoint", "referenceGap"],
} as const;
/** Calculate cyclic voltammetry peak separation gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { anodicPeak, cathodicPeak, referenceSeparation } = request;
  const compute = (): Output => {
    H.domain(anodicPeak >= cathodicPeak && referenceSeparation >= 0);
    return {
      separation: anodicPeak - cathodicPeak,
      midpoint: (anodicPeak + cathodicPeak) / 2,
      referenceGap: anodicPeak - cathodicPeak - referenceSeparation,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { anodicPeak: 0.3, cathodicPeak: 0.1, referenceSeparation: 0.06 },
  output: {
    separation: 0.19999999999999998,
    midpoint: 0.2,
    referenceGap: 0.13999999999999999,
  },
} satisfies ToolExample<Input, Output>;
export const cyclicVoltammetryPeakSeparationGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "electrochemistry/cyclic-voltammetry-peak-separation-gap",
    title: "Cyclic Voltammetry Peak Separation Gap Tool",
    description:
      "Calculate cyclic voltammetry peak separation gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        anodicPeak: { type: "number" },
        cathodicPeak: { type: "number" },
        referenceSeparation: { type: "number", minimum: 0 },
      },
      required: ["anodicPeak", "cathodicPeak", "referenceSeparation"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        separation: { type: "number" },
        midpoint: { type: "number" },
        referenceGap: { type: "number" },
      },
      required: ["separation", "midpoint", "referenceGap"],
    },
    ports: {
      inputs: [
        {
          id: "anodicPeak",
          label: "Anodic Peak",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "cathodicPeak",
          label: "Cathodic Peak",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceSeparation",
          label: "Reference Separation",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "separation",
          label: "Separation",
          valueType: { type: "number" },
        },
        { id: "midpoint", label: "Midpoint", valueType: { type: "number" } },
        {
          id: "referenceGap",
          label: "Reference Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = cyclicVoltammetryPeakSeparationGapTool.execute;
export default cyclicVoltammetryPeakSeparationGapTool;
