import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly energy: number;
  readonly momentum: readonly number[];
  readonly mass: number;
  readonly speedOfLight: number;
};
export type Output = { readonly invariant: number; readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    energy: { type: "number" },
    momentum: { type: "array", maxItems: 256, items: { type: "number" } },
    mass: { type: "number", minimum: 0 },
    speedOfLight: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["energy", "momentum", "mass", "speedOfLight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { invariant: { type: "number" }, residual: { type: "number" } },
  required: ["invariant", "residual"],
} as const;
/** Signed +--- four-momentum norm residual in consistent caller-supplied units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { energy, momentum, mass, speedOfLight } = request;
  const compute = (): Output => {
    H.domain(momentum.length > 0 && mass >= 0);
    H.positive(speedOfLight);
    return {
      invariant: (energy / speedOfLight) ** 2 - H.dot(momentum, momentum),
      residual:
        (energy / speedOfLight) ** 2 -
        H.dot(momentum, momentum) -
        (mass * speedOfLight) ** 2,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { energy: 10, momentum: [3, 0, 0], mass: 4, speedOfLight: 2 },
  output: { invariant: 16, residual: -48 },
} satisfies ToolExample<Input, Output>;
export const relativisticFourMomentumNormResidualTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "physics/relativistic-four-momentum-norm-residual",
      title: "Relativistic Four Momentum Norm Residual Tool",
      description:
        "Signed +--- four-momentum norm residual in consistent caller-supplied units.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          energy: { type: "number" },
          momentum: { type: "array", maxItems: 256, items: { type: "number" } },
          mass: { type: "number", minimum: 0 },
          speedOfLight: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["energy", "momentum", "mass", "speedOfLight"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          invariant: { type: "number" },
          residual: { type: "number" },
        },
        required: ["invariant", "residual"],
      },
      ports: {
        inputs: [
          {
            id: "energy",
            label: "Energy",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "momentum",
            label: "Momentum",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "mass",
            label: "Mass",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "speedOfLight",
            label: "Speed Of Light",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "invariant",
            label: "Invariant",
            valueType: { type: "number" },
          },
          { id: "residual", label: "Residual", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = relativisticFourMomentumNormResidualTool.execute;
export default relativisticFourMomentumNormResidualTool;
