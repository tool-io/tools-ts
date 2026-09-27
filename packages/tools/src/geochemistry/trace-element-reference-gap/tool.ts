import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredConcentration: number;
  readonly referenceConcentration: number;
  readonly reportingQuantum: number;
};
export type Output = {
  readonly difference: number;
  readonly relativeDifference: number;
  readonly quantumDifference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredConcentration: { type: "number", minimum: 0 },
    referenceConcentration: { type: "number", exclusiveMinimum: 0 },
    reportingQuantum: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "measuredConcentration",
    "referenceConcentration",
    "reportingQuantum",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    difference: { type: "number" },
    relativeDifference: { type: "number" },
    quantumDifference: { type: "number" },
  },
  required: ["difference", "relativeDifference", "quantumDifference"],
} as const;
/** Calculate trace element reference gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { measuredConcentration, referenceConcentration, reportingQuantum } =
    request;
  const compute = (): Output => {
    H.domain(measuredConcentration >= 0);
    H.positive(referenceConcentration);
    H.positive(reportingQuantum);
    return {
      difference: measuredConcentration - referenceConcentration,
      relativeDifference:
        (measuredConcentration - referenceConcentration) /
        referenceConcentration,
      quantumDifference:
        (measuredConcentration - referenceConcentration) / reportingQuantum,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    measuredConcentration: 12,
    referenceConcentration: 10,
    reportingQuantum: 0.5,
  },
  output: { difference: 2, relativeDifference: 0.2, quantumDifference: 4 },
} satisfies ToolExample<Input, Output>;
export const traceElementReferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geochemistry/trace-element-reference-gap",
    title: "Trace Element Reference Gap Tool",
    description:
      "Calculate trace element reference gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredConcentration: { type: "number", minimum: 0 },
        referenceConcentration: { type: "number", exclusiveMinimum: 0 },
        reportingQuantum: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "measuredConcentration",
        "referenceConcentration",
        "reportingQuantum",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        difference: { type: "number" },
        relativeDifference: { type: "number" },
        quantumDifference: { type: "number" },
      },
      required: ["difference", "relativeDifference", "quantumDifference"],
    },
    ports: {
      inputs: [
        {
          id: "measuredConcentration",
          label: "Measured Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceConcentration",
          label: "Reference Concentration",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reportingQuantum",
          label: "Reporting Quantum",
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
        {
          id: "relativeDifference",
          label: "Relative Difference",
          valueType: { type: "number" },
        },
        {
          id: "quantumDifference",
          label: "Quantum Difference",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = traceElementReferenceGapTool.execute;
export default traceElementReferenceGapTool;
