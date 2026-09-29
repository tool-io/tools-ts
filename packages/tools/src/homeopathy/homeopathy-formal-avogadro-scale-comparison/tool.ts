import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly initialMoles: number;
  readonly log10Fraction: number;
  readonly suppliedAvogadro: number;
};
export type Output = {
  readonly log10ExpectedEntities: number;
  readonly expectedEntities: number;
  readonly belowOne: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    initialMoles: { type: "number", exclusiveMinimum: 0 },
    log10Fraction: { type: "number", maximum: 0 },
    suppliedAvogadro: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["initialMoles", "log10Fraction", "suppliedAvogadro"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    log10ExpectedEntities: { type: "number" },
    expectedEntities: { type: "number" },
    belowOne: { type: "boolean" },
  },
  required: ["log10ExpectedEntities", "expectedEntities", "belowOne"],
} as const;
/** Formal ideal-dilution entity expectation from explicitly supplied quantities. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { initialMoles, log10Fraction, suppliedAvogadro } = request;
  const compute = (): Output => {
    H.positive(initialMoles);
    H.positive(suppliedAvogadro);
    H.domain(log10Fraction <= 0);
    return {
      log10ExpectedEntities:
        Math.log10(initialMoles) + Math.log10(suppliedAvogadro) + log10Fraction,
      expectedEntities:
        10 **
        (Math.log10(initialMoles) +
          Math.log10(suppliedAvogadro) +
          log10Fraction),
      belowOne:
        Math.log10(initialMoles) +
          Math.log10(suppliedAvogadro) +
          log10Fraction <
        0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    initialMoles: 1,
    log10Fraction: -24,
    suppliedAvogadro: 6.02214076e23,
  },
  output: {
    log10ExpectedEntities: -0.22024909761488587,
    expectedEntities: 0.6022140759999983,
    belowOne: true,
  },
} satisfies ToolExample<Input, Output>;
export const homeopathyFormalAvogadroScaleComparisonTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "homeopathy/homeopathy-formal-avogadro-scale-comparison",
      title: "Homeopathy Formal Avogadro Scale Comparison Tool",
      description:
        "Formal ideal-dilution entity expectation from explicitly supplied quantities.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          initialMoles: { type: "number", exclusiveMinimum: 0 },
          log10Fraction: { type: "number", maximum: 0 },
          suppliedAvogadro: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["initialMoles", "log10Fraction", "suppliedAvogadro"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          log10ExpectedEntities: { type: "number" },
          expectedEntities: { type: "number" },
          belowOne: { type: "boolean" },
        },
        required: ["log10ExpectedEntities", "expectedEntities", "belowOne"],
      },
      ports: {
        inputs: [
          {
            id: "initialMoles",
            label: "Initial Moles",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "log10Fraction",
            label: "Log10Fraction",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "suppliedAvogadro",
            label: "Supplied Avogadro",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "log10ExpectedEntities",
            label: "Log10Expected Entities",
            valueType: { type: "number" },
          },
          {
            id: "expectedEntities",
            label: "Expected Entities",
            valueType: { type: "number" },
          },
          {
            id: "belowOne",
            label: "Below One",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = homeopathyFormalAvogadroScaleComparisonTool.execute;
export default homeopathyFormalAvogadroScaleComparisonTool;
