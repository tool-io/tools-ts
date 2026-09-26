import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly bodyMassKg: number;
  readonly totalWingAreaM2: number;
  readonly gravity: number;
};
export type Output = {
  readonly massLoading: number;
  readonly weightLoading: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    bodyMassKg: { type: "number", minimum: 0 },
    totalWingAreaM2: { type: "number", exclusiveMinimum: 0 },
    gravity: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["bodyMassKg", "totalWingAreaM2", "gravity"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    massLoading: { type: "number" },
    weightLoading: { type: "number" },
  },
  required: ["massLoading", "weightLoading"],
} as const;
/** Distinguish kg/m2 mass loading from N/m2 weight loading using the total area of all wings. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { bodyMassKg, totalWingAreaM2, gravity } = request;
  const compute = (): Output => {
    H.domain(bodyMassKg >= 0);
    H.positive(totalWingAreaM2);
    H.positive(gravity);
    const massLoading = bodyMassKg / totalWingAreaM2;
    return { massLoading, weightLoading: massLoading * gravity };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { bodyMassKg: 0.002, totalWingAreaM2: 0.0004, gravity: 10 },
  output: { massLoading: 5, weightLoading: 50 },
} satisfies ToolExample<Input, Output>;
export const wingLoadingMassAreaFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entomology/wing-loading-mass-area-factor",
    title: "Wing Loading Mass Area Factor Tool",
    description:
      "Distinguish kg/m2 mass loading from N/m2 weight loading using the total area of all wings.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        bodyMassKg: { type: "number", minimum: 0 },
        totalWingAreaM2: { type: "number", exclusiveMinimum: 0 },
        gravity: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["bodyMassKg", "totalWingAreaM2", "gravity"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        massLoading: { type: "number" },
        weightLoading: { type: "number" },
      },
      required: ["massLoading", "weightLoading"],
    },
    ports: {
      inputs: [
        {
          id: "bodyMassKg",
          label: "Body Mass Kg",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "totalWingAreaM2",
          label: "Total Wing Area M2",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "gravity",
          label: "Gravity",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "massLoading",
          label: "Mass Loading",
          valueType: { type: "number" },
        },
        {
          id: "weightLoading",
          label: "Weight Loading",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = wingLoadingMassAreaFactorTool.execute;
export default wingLoadingMassAreaFactorTool;
