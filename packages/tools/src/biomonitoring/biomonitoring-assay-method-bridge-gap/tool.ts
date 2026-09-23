import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstResult: number;
  readonly secondResult: number;
  readonly firstFactor: number;
  readonly secondFactor: number;
  readonly reference: number;
};
export type Output = {
  readonly firstCoherent: number;
  readonly secondCoherent: number;
  readonly difference: number;
  readonly relativeDifference: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstResult: { type: "number" },
    secondResult: { type: "number" },
    firstFactor: { type: "number", exclusiveMinimum: 0 },
    secondFactor: { type: "number", exclusiveMinimum: 0 },
    reference: { type: "number" },
  },
  required: [
    "firstResult",
    "secondResult",
    "firstFactor",
    "secondFactor",
    "reference",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstCoherent: { type: "number" },
    secondCoherent: { type: "number" },
    difference: { type: "number" },
    relativeDifference: { type: "number" },
  },
  required: [
    "firstCoherent",
    "secondCoherent",
    "difference",
    "relativeDifference",
  ],
} as const;
/** Calculate biomonitoring assay method bridge gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstResult, secondResult, firstFactor, secondFactor, reference } =
    request;
  const compute = (): Output => {
    H.positive(firstFactor);
    H.positive(secondFactor);
    H.domain(reference !== 0);
    return {
      firstCoherent: firstResult * firstFactor,
      secondCoherent: secondResult * secondFactor,
      difference: secondResult * secondFactor - firstResult * firstFactor,
      relativeDifference:
        (secondResult * secondFactor - firstResult * firstFactor) / reference,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    firstResult: 10,
    secondResult: 6,
    firstFactor: 1,
    secondFactor: 2,
    reference: 10,
  },
  output: {
    firstCoherent: 10,
    secondCoherent: 12,
    difference: 2,
    relativeDifference: 0.2,
  },
} satisfies ToolExample<Input, Output>;
export const biomonitoringAssayMethodBridgeGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biomonitoring/biomonitoring-assay-method-bridge-gap",
    title: "Biomonitoring Assay Method Bridge Gap Tool",
    description:
      "Calculate biomonitoring assay method bridge gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstResult: { type: "number" },
        secondResult: { type: "number" },
        firstFactor: { type: "number", exclusiveMinimum: 0 },
        secondFactor: { type: "number", exclusiveMinimum: 0 },
        reference: { type: "number" },
      },
      required: [
        "firstResult",
        "secondResult",
        "firstFactor",
        "secondFactor",
        "reference",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstCoherent: { type: "number" },
        secondCoherent: { type: "number" },
        difference: { type: "number" },
        relativeDifference: { type: "number" },
      },
      required: [
        "firstCoherent",
        "secondCoherent",
        "difference",
        "relativeDifference",
      ],
    },
    ports: {
      inputs: [
        {
          id: "firstResult",
          label: "First Result",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondResult",
          label: "Second Result",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstFactor",
          label: "First Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondFactor",
          label: "Second Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reference",
          label: "Reference",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "firstCoherent",
          label: "First Coherent",
          valueType: { type: "number" },
        },
        {
          id: "secondCoherent",
          label: "Second Coherent",
          valueType: { type: "number" },
        },
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
      ],
    },
  },
  calculate,
});
export const run = biomonitoringAssayMethodBridgeGapTool.execute;
export default biomonitoringAssayMethodBridgeGapTool;
