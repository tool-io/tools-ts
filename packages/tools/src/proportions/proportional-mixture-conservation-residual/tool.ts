import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly componentMasses: readonly number[];
  readonly suppliedTotalMass: number;
};
export type Output = {
  readonly summedComponentMass: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    componentMasses: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    suppliedTotalMass: { type: "number", minimum: 0 },
  },
  required: ["componentMasses", "suppliedTotalMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    summedComponentMass: { type: "number" },
    residual: { type: "number" },
  },
  required: ["summedComponentMass", "residual"],
} as const;
/** Compare a supplied mixture total with explicitly recorded compatible component masses, preserving signed imbalance. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { componentMasses, suppliedTotalMass } = request;
  const compute = (): Output => {
    H.domain(suppliedTotalMass >= 0, "suppliedTotalMass");
    return (() => {
      H.domain(
        componentMasses.every((value) => value >= 0),
        "componentMasses",
      );
      const summedComponentMass = componentMasses.reduce((a, b) => a + b, 0);
      return {
        summedComponentMass,
        residual: suppliedTotalMass - summedComponentMass,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { componentMasses: [2, 3, 4], suppliedTotalMass: 10 },
  output: { summedComponentMass: 9, residual: 1 },
} satisfies ToolExample<Input, Output>;
export const proportionalMixtureConservationResidualTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["proportions", "mathematics"],
        keywords: ["proportions", "mathematics"],
      },
      id: "proportions/proportional-mixture-conservation-residual",
      title: "Proportional Mixture Conservation Residual",
      description:
        "Compare a supplied mixture total with explicitly recorded compatible component masses, preserving signed imbalance.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          componentMasses: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          suppliedTotalMass: { type: "number", minimum: 0 },
        },
        required: ["componentMasses", "suppliedTotalMass"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          summedComponentMass: { type: "number" },
          residual: { type: "number" },
        },
        required: ["summedComponentMass", "residual"],
      },
      ports: {
        inputs: [
          {
            id: "componentMasses",
            label: "Component Masses",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "suppliedTotalMass",
            label: "Supplied Total Mass",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "summedComponentMass",
            label: "Summed Component Mass",
            valueType: { type: "number" },
          },
          { id: "residual", label: "Residual", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = proportionalMixtureConservationResidualTool.execute;
export default proportionalMixtureConservationResidualTool;
