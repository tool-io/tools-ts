import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly signal: number;
  readonly blank: number;
  readonly wetMass: number;
  readonly dryFraction: number;
  readonly suppliedCalibration: number;
};
export type Output = {
  readonly dryMass: number;
  readonly amountPerDryMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    signal: { type: "number" },
    blank: { type: "number" },
    wetMass: { type: "number", exclusiveMinimum: 0 },
    dryFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
    suppliedCalibration: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "signal",
    "blank",
    "wetMass",
    "dryFraction",
    "suppliedCalibration",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dryMass: { type: "number" },
    amountPerDryMass: { type: "number" },
  },
  required: ["dryMass", "amountPerDryMass"],
} as const;
/** Signed blank-corrected research assay normalization using a supplied calibration; no clinical range. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { signal, blank, wetMass, dryFraction, suppliedCalibration } = request;
  const compute = (): Output => {
    H.positive(wetMass);
    H.domain(dryFraction > 0 && dryFraction <= 1);
    H.positive(suppliedCalibration);
    return {
      dryMass: wetMass * dryFraction,
      amountPerDryMass:
        ((signal - blank) * suppliedCalibration) / (wetMass * dryFraction),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    signal: 10,
    blank: 2,
    wetMass: 4,
    dryFraction: 0.5,
    suppliedCalibration: 3,
  },
  output: { dryMass: 2, amountPerDryMass: 12 },
} satisfies ToolExample<Input, Output>;
export const digestiveAssayMassBasisFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "gastroenterology/digestive-assay-mass-basis-factor",
    title: "Digestive Assay Mass Basis Factor Tool",
    description:
      "Signed blank-corrected research assay normalization using a supplied calibration; no clinical range.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        signal: { type: "number" },
        blank: { type: "number" },
        wetMass: { type: "number", exclusiveMinimum: 0 },
        dryFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
        suppliedCalibration: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "signal",
        "blank",
        "wetMass",
        "dryFraction",
        "suppliedCalibration",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dryMass: { type: "number" },
        amountPerDryMass: { type: "number" },
      },
      required: ["dryMass", "amountPerDryMass"],
    },
    ports: {
      inputs: [
        {
          id: "signal",
          label: "Signal",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "blank",
          label: "Blank",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "wetMass",
          label: "Wet Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "dryFraction",
          label: "Dry Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
        {
          id: "suppliedCalibration",
          label: "Supplied Calibration",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "dryMass", label: "Dry Mass", valueType: { type: "number" } },
        {
          id: "amountPerDryMass",
          label: "Amount Per Dry Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = digestiveAssayMassBasisFactorTool.execute;
export default digestiveAssayMassBasisFactorTool;
