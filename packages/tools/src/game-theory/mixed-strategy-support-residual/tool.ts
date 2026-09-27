import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly probabilities: readonly number[];
  readonly inSupport: readonly boolean[];
};
export type Output = {
  readonly outsideMass: number;
  readonly supportedMass: number;
  readonly totalResidual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    probabilities: { type: "array", maxItems: 256, items: { type: "number" } },
    inSupport: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["probabilities", "inSupport"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    outsideMass: { type: "number" },
    supportedMass: { type: "number" },
    totalResidual: { type: "number" },
  },
  required: ["outsideMass", "supportedMass", "totalResidual"],
} as const;
/** Audit supplied candidate strategy mass against an explicit support mask without certifying an equilibrium. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { probabilities, inSupport } = request;
  const compute = (): Output => {
    H.sameLength(probabilities, inSupport);
    H.domain(probabilities.every((x) => x >= 0 && x <= 1));
    return {
      outsideMass: probabilities.reduce(
        (a, b, i) => a + (inSupport[i] ? 0 : b),
        0,
      ),
      supportedMass: probabilities.reduce(
        (a, b, i) => a + (inSupport[i] ? b : 0),
        0,
      ),
      totalResidual: 1 - probabilities.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { probabilities: [0.2, 0.3, 0.5], inSupport: [true, false, true] },
  output: { outsideMass: 0.3, supportedMass: 0.7, totalResidual: 0 },
} satisfies ToolExample<Input, Output>;
export const mixedStrategySupportResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "game-theory/mixed-strategy-support-residual",
    title: "Mixed Strategy Support Residual Tool",
    description:
      "Audit supplied candidate strategy mass against an explicit support mask without certifying an equilibrium.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        probabilities: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        inSupport: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["probabilities", "inSupport"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        outsideMass: { type: "number" },
        supportedMass: { type: "number" },
        totalResidual: { type: "number" },
      },
      required: ["outsideMass", "supportedMass", "totalResidual"],
    },
    ports: {
      inputs: [
        {
          id: "probabilities",
          label: "Probabilities",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "inSupport",
          label: "In Support",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "outsideMass",
          label: "Outside Mass",
          valueType: { type: "number" },
        },
        {
          id: "supportedMass",
          label: "Supported Mass",
          valueType: { type: "number" },
        },
        {
          id: "totalResidual",
          label: "Total Residual",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = mixedStrategySupportResidualTool.execute;
export default mixedStrategySupportResidualTool;
