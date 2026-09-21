import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly masses: readonly number[];
  readonly fractions: readonly number[];
};
export type Output = {
  readonly componentMass: number;
  readonly blendFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    masses: { type: "array", maxItems: 256, items: { type: "number" } },
    fractions: { type: "array", maxItems: 256, items: { type: "number" } },
  },
  required: ["masses", "fractions"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    componentMass: { type: "number" },
    blendFraction: { type: "number" },
  },
  required: ["componentMass", "blendFraction"],
} as const;
/** Calculate nutrient blend one component balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { masses, fractions } = request;
  const compute = (): Output => {
    H.sameLength(masses, fractions);
    H.domain(
      masses.every((x) => x >= 0) &&
        fractions.every((x) => x >= 0 && x <= 1) &&
        masses.reduce((a, b) => a + b, 0) > 0,
    );
    return {
      componentMass: H.dot(masses, fractions),
      blendFraction:
        H.dot(masses, fractions) / masses.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { masses: [20, 80], fractions: [0.1, 0.3] },
  output: { componentMass: 26, blendFraction: 0.26 },
} satisfies ToolExample<Input, Output>;
export const nutrientBlendOneComponentBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agrochemistry/nutrient-blend-one-component-balance",
    title: "Nutrient Blend One Component Balance Tool",
    description:
      "Calculate nutrient blend one component balance from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        masses: { type: "array", maxItems: 256, items: { type: "number" } },
        fractions: { type: "array", maxItems: 256, items: { type: "number" } },
      },
      required: ["masses", "fractions"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        componentMass: { type: "number" },
        blendFraction: { type: "number" },
      },
      required: ["componentMass", "blendFraction"],
    },
    ports: {
      inputs: [
        {
          id: "masses",
          label: "Masses",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "fractions",
          label: "Fractions",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
      ],
      outputs: [
        {
          id: "componentMass",
          label: "Component Mass",
          valueType: { type: "number" },
        },
        {
          id: "blendFraction",
          label: "Blend Fraction",
          valueType: { type: "number", unit: "1" },
        },
      ],
    },
  },
  calculate,
});
export const run = nutrientBlendOneComponentBalanceTool.execute;
export default nutrientBlendOneComponentBalanceTool;
