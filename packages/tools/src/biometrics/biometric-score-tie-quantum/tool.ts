import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstScore: number;
  readonly secondScore: number;
  readonly quantum: number;
  readonly origin: number;
};
export type Output = {
  readonly firstBin: number;
  readonly secondBin: number;
  readonly tied: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstScore: { type: "number" },
    secondScore: { type: "number" },
    quantum: { type: "number", exclusiveMinimum: 0 },
    origin: { type: "number" },
  },
  required: ["firstScore", "secondScore", "quantum", "origin"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstBin: { type: "number" },
    secondBin: { type: "number" },
    tied: { type: "boolean" },
  },
  required: ["firstBin", "secondBin", "tied"],
} as const;
/** Compare supplied scores in half-open floor bins; no identity match or recognition accuracy is inferred. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstScore, secondScore, quantum, origin } = request;
  const compute = (): Output => {
    H.positive(quantum);
    const firstBin = Math.floor((firstScore - origin) / quantum),
      secondBin = Math.floor((secondScore - origin) / quantum);
    return { firstBin, secondBin, tied: firstBin === secondBin };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstScore: 0.81, secondScore: 0.85, quantum: 0.1, origin: 0 },
  output: { firstBin: 8, secondBin: 8, tied: true },
} satisfies ToolExample<Input, Output>;
export const biometricScoreTieQuantumTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biometrics/biometric-score-tie-quantum",
    title: "Biometric Score Tie Quantum Tool",
    description:
      "Compare supplied scores in half-open floor bins; no identity match or recognition accuracy is inferred.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstScore: { type: "number" },
        secondScore: { type: "number" },
        quantum: { type: "number", exclusiveMinimum: 0 },
        origin: { type: "number" },
      },
      required: ["firstScore", "secondScore", "quantum", "origin"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstBin: { type: "number" },
        secondBin: { type: "number" },
        tied: { type: "boolean" },
      },
      required: ["firstBin", "secondBin", "tied"],
    },
    ports: {
      inputs: [
        {
          id: "firstScore",
          label: "First Score",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondScore",
          label: "Second Score",
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
          id: "origin",
          label: "Origin",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "firstBin", label: "First Bin", valueType: { type: "number" } },
        { id: "secondBin", label: "Second Bin", valueType: { type: "number" } },
        { id: "tied", label: "Tied", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = biometricScoreTieQuantumTool.execute;
export default biometricScoreTieQuantumTool;
