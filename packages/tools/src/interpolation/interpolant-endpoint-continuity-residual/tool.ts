import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly leftLimit: number; readonly rightLimit: number };
export type Output = {
  readonly jump: number;
  readonly continuousExactly: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { leftLimit: { type: "number" }, rightLimit: { type: "number" } },
  required: ["leftLimit", "rightLimit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    jump: { type: "number" },
    continuousExactly: { type: "boolean" },
  },
  required: ["jump", "continuousExactly"],
} as const;
/** Compare supplied one-sided interpolant limits; continuity is exact numeric equality, with no inferred tolerance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { leftLimit, rightLimit } = request;
  const compute = (): Output => {
    return {
      jump: rightLimit - leftLimit,
      continuousExactly: leftLimit === rightLimit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { leftLimit: 3, rightLimit: 3.25 },
  output: { jump: 0.25, continuousExactly: false },
} satisfies ToolExample<Input, Output>;
export const interpolantEndpointContinuityResidualTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "interpolation/interpolant-endpoint-continuity-residual",
      title: "Interpolant Endpoint Continuity Residual Tool",
      description:
        "Compare supplied one-sided interpolant limits; continuity is exact numeric equality, with no inferred tolerance.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          leftLimit: { type: "number" },
          rightLimit: { type: "number" },
        },
        required: ["leftLimit", "rightLimit"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          jump: { type: "number" },
          continuousExactly: { type: "boolean" },
        },
        required: ["jump", "continuousExactly"],
      },
      ports: {
        inputs: [
          {
            id: "leftLimit",
            label: "Left Limit",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "rightLimit",
            label: "Right Limit",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "jump", label: "Jump", valueType: { type: "number" } },
          {
            id: "continuousExactly",
            label: "Continuous Exactly",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = interpolantEndpointContinuityResidualTool.execute;
export default interpolantEndpointContinuityResidualTool;
