import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stiffness: number;
  readonly displacement: number;
  readonly measuredForce: number;
};
export type Output = {
  readonly predictedForce: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stiffness: { type: "number", minimum: 0 },
    displacement: { type: "number" },
    measuredForce: { type: "number" },
  },
  required: ["stiffness", "displacement", "measuredForce"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    predictedForce: { type: "number" },
    residual: { type: "number" },
  },
  required: ["predictedForce", "residual"],
} as const;
/** Compare a signed restoring-force measurement to the ideal linear trap model F=-k*x. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stiffness, displacement, measuredForce } = request;
  const compute = (): Output => {
    H.domain(stiffness >= 0);
    return {
      predictedForce: -stiffness * displacement,
      residual: measuredForce + stiffness * displacement,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stiffness: 2, displacement: 3, measuredForce: -5 },
  output: { predictedForce: -6, residual: 1 },
} satisfies ToolExample<Input, Output>;
export const trapForceDisplacementResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biophysics/trap-force-displacement-residual",
    title: "Trap Force Displacement Residual Tool",
    description:
      "Compare a signed restoring-force measurement to the ideal linear trap model F=-k*x.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stiffness: { type: "number", minimum: 0 },
        displacement: { type: "number" },
        measuredForce: { type: "number" },
      },
      required: ["stiffness", "displacement", "measuredForce"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        predictedForce: { type: "number" },
        residual: { type: "number" },
      },
      required: ["predictedForce", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "stiffness",
          label: "Stiffness",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "displacement",
          label: "Displacement",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredForce",
          label: "Measured Force",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "predictedForce",
          label: "Predicted Force",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = trapForceDisplacementResidualTool.execute;
export default trapForceDisplacementResidualTool;
