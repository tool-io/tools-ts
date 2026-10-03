import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly roundedValue: number;
  readonly quantum: number;
  readonly lowerClosed: boolean;
  readonly upperClosed: boolean;
  readonly candidate: number;
};
export type Output = {
  readonly lower: number;
  readonly upper: number;
  readonly candidateCompatible: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    roundedValue: { type: "number" },
    quantum: { type: "number", exclusiveMinimum: 0 },
    lowerClosed: { type: "boolean" },
    upperClosed: { type: "boolean" },
    candidate: { type: "number" },
  },
  required: [
    "roundedValue",
    "quantum",
    "lowerClosed",
    "upperClosed",
    "candidate",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    lower: { type: "number" },
    upper: { type: "number" },
    candidateCompatible: { type: "boolean" },
  },
  required: ["lower", "upper", "candidateCompatible"],
} as const;
/** Inspect a supplied nearest-rounding interval and tie endpoint convention without rerounding an assay result. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { roundedValue, quantum, lowerClosed, upperClosed, candidate } =
    request;
  const compute = (): Output => {
    H.positive(quantum);
    const lower = roundedValue - quantum / 2,
      upper = roundedValue + quantum / 2;
    return {
      lower,
      upper,
      candidateCompatible:
        (lowerClosed ? candidate >= lower : candidate > lower) &&
        (upperClosed ? candidate <= upper : candidate < upper),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    roundedValue: 10,
    quantum: 2,
    lowerClosed: true,
    upperClosed: false,
    candidate: 11,
  },
  output: { lower: 9, upper: 11, candidateCompatible: false },
} satisfies ToolExample<Input, Output>;
export const qcResultRoundingClosureTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "quality-control/qc-result-rounding-closure-token",
    title: "QC Result Rounding Closure Token Tool",
    description:
      "Inspect a supplied nearest-rounding interval and tie endpoint convention without rerounding an assay result.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        roundedValue: { type: "number" },
        quantum: { type: "number", exclusiveMinimum: 0 },
        lowerClosed: { type: "boolean" },
        upperClosed: { type: "boolean" },
        candidate: { type: "number" },
      },
      required: [
        "roundedValue",
        "quantum",
        "lowerClosed",
        "upperClosed",
        "candidate",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        lower: { type: "number" },
        upper: { type: "number" },
        candidateCompatible: { type: "boolean" },
      },
      required: ["lower", "upper", "candidateCompatible"],
    },
    ports: {
      inputs: [
        {
          id: "roundedValue",
          label: "Rounded Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "quantum",
          label: "Quantum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lowerClosed",
          label: "Lower Closed",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "upperClosed",
          label: "Upper Closed",
          required: true,
          valueType: { type: "boolean" },
        },
        {
          id: "candidate",
          label: "Candidate",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "lower", label: "Lower", valueType: { type: "number" } },
        { id: "upper", label: "Upper", valueType: { type: "number" } },
        {
          id: "candidateCompatible",
          label: "Candidate Compatible",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = qcResultRoundingClosureTokenTool.execute;
export default qcResultRoundingClosureTokenTool;
