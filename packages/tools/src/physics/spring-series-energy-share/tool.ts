import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly firstStiffness: number;
  readonly secondStiffness: number;
  readonly totalEnergy: number;
};
export type Output = {
  readonly firstEnergy: number;
  readonly secondEnergy: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstStiffness: { type: "number", exclusiveMinimum: 0 },
    secondStiffness: { type: "number", exclusiveMinimum: 0 },
    totalEnergy: { type: "number", minimum: 0 },
  },
  required: ["firstStiffness", "secondStiffness", "totalEnergy"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    firstEnergy: { type: "number" },
    secondEnergy: { type: "number" },
  },
  required: ["firstEnergy", "secondEnergy"],
} as const;
/** Share stored energy between two ideal series springs carrying the same force. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { firstStiffness, secondStiffness, totalEnergy } = request;
  const compute = (): Output => {
    H.positive(firstStiffness);
    H.positive(secondStiffness);
    H.domain(totalEnergy >= 0);
    return {
      firstEnergy:
        (totalEnergy * secondStiffness) / (firstStiffness + secondStiffness),
      secondEnergy:
        (totalEnergy * firstStiffness) / (firstStiffness + secondStiffness),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { firstStiffness: 100, secondStiffness: 300, totalEnergy: 40 },
  output: { firstEnergy: 30, secondEnergy: 10 },
} satisfies ToolExample<Input, Output>;
export const springSeriesEnergyShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "physics/spring-series-energy-share",
    title: "Spring Series Energy Share Tool",
    description:
      "Share stored energy between two ideal series springs carrying the same force.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstStiffness: { type: "number", exclusiveMinimum: 0 },
        secondStiffness: { type: "number", exclusiveMinimum: 0 },
        totalEnergy: { type: "number", minimum: 0 },
      },
      required: ["firstStiffness", "secondStiffness", "totalEnergy"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        firstEnergy: { type: "number" },
        secondEnergy: { type: "number" },
      },
      required: ["firstEnergy", "secondEnergy"],
    },
    ports: {
      inputs: [
        {
          id: "firstStiffness",
          label: "First Stiffness",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "secondStiffness",
          label: "Second Stiffness",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalEnergy",
          label: "Total Energy",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "firstEnergy",
          label: "First Energy",
          valueType: { type: "number" },
        },
        {
          id: "secondEnergy",
          label: "Second Energy",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = springSeriesEnergyShareTool.execute;
export default springSeriesEnergyShareTool;
