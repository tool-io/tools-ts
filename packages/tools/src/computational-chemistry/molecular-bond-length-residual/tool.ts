import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedLength: number;
  readonly targetLength: number;
};
export type Output = {
  readonly residual: number;
  readonly squaredResidual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedLength: { type: "number", minimum: 0 },
    targetLength: { type: "number", minimum: 0 },
  },
  required: ["observedLength", "targetLength"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    residual: { type: "number" },
    squaredResidual: { type: "number" },
  },
  required: ["residual", "squaredResidual"],
} as const;
/** Describe signed and squared bond-length residuals against an explicit target in the same length unit. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedLength, targetLength } = request;
  const compute = (): Output => {
    H.domain(observedLength >= 0 && targetLength >= 0, "observedLength");
    return {
      residual: observedLength - targetLength,
      squaredResidual: (observedLength - targetLength) ** 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedLength: 1.5, targetLength: 1.4 },
  output: {
    residual: 0.10000000000000009,
    squaredResidual: 0.010000000000000018,
  },
} satisfies ToolExample<Input, Output>;
export const molecularBondLengthResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: [
        "computational-chemistry",
        "computational chemistry",
        "chemistry",
      ],
      keywords: ["computational chemistry", "chemistry"],
    },
    id: "computational-chemistry/molecular-bond-length-residual",
    title: "Molecular Bond Length Residual",
    description:
      "Describe signed and squared bond-length residuals against an explicit target in the same length unit.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedLength: { type: "number", minimum: 0 },
        targetLength: { type: "number", minimum: 0 },
      },
      required: ["observedLength", "targetLength"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        residual: { type: "number" },
        squaredResidual: { type: "number" },
      },
      required: ["residual", "squaredResidual"],
    },
    ports: {
      inputs: [
        {
          id: "observedLength",
          label: "Observed Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetLength",
          label: "Target Length",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "residual", label: "Residual", valueType: { type: "number" } },
        {
          id: "squaredResidual",
          label: "Squared Residual",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = molecularBondLengthResidualTool.execute;
export default molecularBondLengthResidualTool;
