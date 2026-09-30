import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly oldEntry: number;
  readonly newEntry: number;
  readonly squaredNorm: number;
};
export type Output = {
  readonly squaredDelta: number;
  readonly updatedSquaredNorm: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    oldEntry: { type: "number" },
    newEntry: { type: "number" },
    squaredNorm: { type: "number" },
  },
  required: ["oldEntry", "newEntry", "squaredNorm"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    squaredDelta: { type: "number" },
    updatedSquaredNorm: { type: "number" },
  },
  required: ["squaredDelta", "updatedSquaredNorm"],
} as const;
/** Calculate matrix one entry frobenius norm delta from explicit caller-supplied inputs. */
export function calculate(input: Input): Output {
  H.requireInput(input, inputSchema);
  const { oldEntry, newEntry, squaredNorm } = input;
  const compute = (): Output => {
    H.domain(squaredNorm >= oldEntry * oldEntry);
    const squaredDelta = newEntry * newEntry - oldEntry * oldEntry;
    return { squaredDelta, updatedSquaredNorm: squaredNorm + squaredDelta };
  };
  const output = H.canonicalOutput(compute());
  H.requireOutput(output, outputSchema);
  return output;
}
export const example = {
  input: { oldEntry: 3, newEntry: 4, squaredNorm: 25 },
  output: { squaredDelta: 7, updatedSquaredNorm: 32 },
} satisfies ToolExample<Input, Output>;
export const matrixOneEntryFrobeniusNormDeltaTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "matrix/matrix-one-entry-frobenius-norm-delta",
    title: "Matrix One Entry Frobenius Norm Delta Tool",
    description:
      "Calculate matrix one entry frobenius norm delta from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        oldEntry: { type: "number" },
        newEntry: { type: "number" },
        squaredNorm: { type: "number" },
      },
      required: ["oldEntry", "newEntry", "squaredNorm"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        squaredDelta: { type: "number" },
        updatedSquaredNorm: { type: "number" },
      },
      required: ["squaredDelta", "updatedSquaredNorm"],
    },
    ports: {
      inputs: [
        {
          id: "oldEntry",
          label: "Old Entry",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "newEntry",
          label: "New Entry",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "squaredNorm",
          label: "Squared Norm",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "squaredDelta",
          label: "Squared Delta",
          valueType: { type: "number" },
        },
        {
          id: "updatedSquaredNorm",
          label: "Updated Squared Norm",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = matrixOneEntryFrobeniusNormDeltaTool.execute;
export default matrixOneEntryFrobeniusNormDeltaTool;
