import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly elasticModulus: number;
  readonly secondMoment: number;
  readonly length: number;
  readonly suppliedEndFactor: number;
};
export type Output = {
  readonly effectiveLength: number;
  readonly criticalLoad: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    elasticModulus: { type: "number", exclusiveMinimum: 0 },
    secondMoment: { type: "number", minimum: 0 },
    length: { type: "number", exclusiveMinimum: 0 },
    suppliedEndFactor: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["elasticModulus", "secondMoment", "length", "suppliedEndFactor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effectiveLength: { type: "number" },
    criticalLoad: { type: "number" },
  },
  required: ["effectiveLength", "criticalLoad"],
} as const;
/** Ideal Euler load with a caller-established end condition and consistent units; no scaffold performance validation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { elasticModulus, secondMoment, length, suppliedEndFactor } = request;
  const compute = (): Output => {
    H.positive(elasticModulus);
    H.domain(secondMoment >= 0);
    H.positive(length);
    H.positive(suppliedEndFactor);
    return {
      effectiveLength: length * suppliedEndFactor,
      criticalLoad:
        (Math.PI ** 2 * elasticModulus * secondMoment) /
        (length * suppliedEndFactor) ** 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    elasticModulus: 100,
    secondMoment: 2,
    length: 10,
    suppliedEndFactor: 1,
  },
  output: { effectiveLength: 10, criticalLoad: 19.739208802178716 },
} satisfies ToolExample<Input, Output>;
export const scaffoldStrutBucklingLengthFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "bioengineering/scaffold-strut-buckling-length-factor",
    title: "Scaffold Strut Buckling Length Factor Tool",
    description:
      "Ideal Euler load with a caller-established end condition and consistent units; no scaffold performance validation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        elasticModulus: { type: "number", exclusiveMinimum: 0 },
        secondMoment: { type: "number", minimum: 0 },
        length: { type: "number", exclusiveMinimum: 0 },
        suppliedEndFactor: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "elasticModulus",
        "secondMoment",
        "length",
        "suppliedEndFactor",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        effectiveLength: { type: "number" },
        criticalLoad: { type: "number" },
      },
      required: ["effectiveLength", "criticalLoad"],
    },
    ports: {
      inputs: [
        {
          id: "elasticModulus",
          label: "Elastic Modulus",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondMoment",
          label: "Second Moment",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedEndFactor",
          label: "Supplied End Factor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "effectiveLength",
          label: "Effective Length",
          valueType: { type: "number" },
        },
        {
          id: "criticalLoad",
          label: "Critical Load",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = scaffoldStrutBucklingLengthFactorTool.execute;
export default scaffoldStrutBucklingLengthFactorTool;
