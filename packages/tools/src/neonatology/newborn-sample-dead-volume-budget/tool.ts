import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly collectedVolume: number;
  readonly deadVolume: number;
  readonly reservedVolume: number;
  readonly aliquotVolume: number;
};
export type Output = {
  readonly availableVolume: number;
  readonly nominalAliquotEquivalent: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    collectedVolume: { type: "number", minimum: 0 },
    deadVolume: { type: "number", minimum: 0 },
    reservedVolume: { type: "number", minimum: 0 },
    aliquotVolume: { type: "number", exclusiveMinimum: 0 },
  },
  required: [
    "collectedVolume",
    "deadVolume",
    "reservedVolume",
    "aliquotVolume",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    availableVolume: { type: "number" },
    nominalAliquotEquivalent: { type: "number" },
  },
  required: ["availableVolume", "nominalAliquotEquivalent"],
} as const;
/** Supplied specimen-volume bookkeeping only; no collection amount or patient procedure recommendation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { collectedVolume, deadVolume, reservedVolume, aliquotVolume } =
    request;
  const compute = (): Output => {
    H.positive(aliquotVolume);
    H.domain(
      collectedVolume >= 0 &&
        deadVolume >= 0 &&
        reservedVolume >= 0 &&
        deadVolume + reservedVolume <= collectedVolume,
    );
    return {
      availableVolume: collectedVolume - deadVolume - reservedVolume,
      nominalAliquotEquivalent:
        (collectedVolume - deadVolume - reservedVolume) / aliquotVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    collectedVolume: 10,
    deadVolume: 2,
    reservedVolume: 1,
    aliquotVolume: 0.5,
  },
  output: { availableVolume: 7, nominalAliquotEquivalent: 14 },
} satisfies ToolExample<Input, Output>;
export const newbornSampleDeadVolumeBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "neonatology/newborn-sample-dead-volume-budget",
    title: "Newborn Sample Dead Volume Budget Tool",
    description:
      "Supplied specimen-volume bookkeeping only; no collection amount or patient procedure recommendation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        collectedVolume: { type: "number", minimum: 0 },
        deadVolume: { type: "number", minimum: 0 },
        reservedVolume: { type: "number", minimum: 0 },
        aliquotVolume: { type: "number", exclusiveMinimum: 0 },
      },
      required: [
        "collectedVolume",
        "deadVolume",
        "reservedVolume",
        "aliquotVolume",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        availableVolume: { type: "number" },
        nominalAliquotEquivalent: { type: "number" },
      },
      required: ["availableVolume", "nominalAliquotEquivalent"],
    },
    ports: {
      inputs: [
        {
          id: "collectedVolume",
          label: "Collected Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "deadVolume",
          label: "Dead Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "reservedVolume",
          label: "Reserved Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "aliquotVolume",
          label: "Aliquot Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "availableVolume",
          label: "Available Volume",
          valueType: { type: "number" },
        },
        {
          id: "nominalAliquotEquivalent",
          label: "Nominal Aliquot Equivalent",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = newbornSampleDeadVolumeBudgetTool.execute;
export default newbornSampleDeadVolumeBudgetTool;
