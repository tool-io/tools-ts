import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly advanceSpeed: number;
  readonly revolutionsPerSecond: number;
  readonly diameter: number;
};
export type Output = { readonly advanceCoefficient: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    advanceSpeed: { type: "number" },
    revolutionsPerSecond: { type: "number", exclusiveMinimum: 0 },
    diameter: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["advanceSpeed", "revolutionsPerSecond", "diameter"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { advanceCoefficient: { type: "number" } },
  required: ["advanceCoefficient"],
} as const;
/** Signed advance coefficient using rotations per second and consistent distance units. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { advanceSpeed, revolutionsPerSecond, diameter } = request;
  const compute = (): Output => {
    H.positive(revolutionsPerSecond);
    H.positive(diameter);
    return {
      advanceCoefficient: advanceSpeed / (revolutionsPerSecond * diameter),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { advanceSpeed: 10, revolutionsPerSecond: 5, diameter: 2 },
  output: { advanceCoefficient: 1 },
} satisfies ToolExample<Input, Output>;
export const propellerAdvanceCoefficientReferenceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "nautical/propeller-advance-coefficient-reference",
      title: "Propeller Advance Coefficient Reference Tool",
      description:
        "Signed advance coefficient using rotations per second and consistent distance units.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          advanceSpeed: { type: "number" },
          revolutionsPerSecond: { type: "number", exclusiveMinimum: 0 },
          diameter: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["advanceSpeed", "revolutionsPerSecond", "diameter"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { advanceCoefficient: { type: "number" } },
        required: ["advanceCoefficient"],
      },
      ports: {
        inputs: [
          {
            id: "advanceSpeed",
            label: "Advance Speed",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "revolutionsPerSecond",
            label: "Revolutions Per Second",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "diameter",
            label: "Diameter",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "advanceCoefficient",
            label: "Advance Coefficient",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = propellerAdvanceCoefficientReferenceTool.execute;
export default propellerAdvanceCoefficientReferenceTool;
