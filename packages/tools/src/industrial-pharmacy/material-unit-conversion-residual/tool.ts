import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly sourceAmount: number;
  readonly unitFactor: number;
  readonly targetReported: number;
};
export type Output = {
  readonly expectedTarget: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sourceAmount: { type: "number" },
    unitFactor: { type: "number", exclusiveMinimum: 0 },
    targetReported: { type: "number" },
  },
  required: ["sourceAmount", "unitFactor", "targetReported"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedTarget: { type: "number" },
    residual: { type: "number" },
  },
  required: ["expectedTarget", "residual"],
} as const;
/** Calculate material unit conversion residual from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sourceAmount, unitFactor, targetReported } = request;
  const compute = (): Output => {
    H.positive(unitFactor);
    return {
      expectedTarget: sourceAmount * unitFactor,
      residual: targetReported - sourceAmount * unitFactor,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sourceAmount: 12, unitFactor: 0.5, targetReported: 7 },
  output: { expectedTarget: 6, residual: 1 },
} satisfies ToolExample<Input, Output>;
export const materialUnitConversionResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-pharmacy/material-unit-conversion-residual",
    title: "Material Unit Conversion Residual Tool",
    description:
      "Calculate material unit conversion residual from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sourceAmount: { type: "number" },
        unitFactor: { type: "number", exclusiveMinimum: 0 },
        targetReported: { type: "number" },
      },
      required: ["sourceAmount", "unitFactor", "targetReported"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedTarget: { type: "number" },
        residual: { type: "number" },
      },
      required: ["expectedTarget", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "sourceAmount",
          label: "Source Amount",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unitFactor",
          label: "Unit Factor",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "targetReported",
          label: "Target Reported",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "expectedTarget",
          label: "Expected Target",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = materialUnitConversionResidualTool.execute;
export default materialUnitConversionResidualTool;
