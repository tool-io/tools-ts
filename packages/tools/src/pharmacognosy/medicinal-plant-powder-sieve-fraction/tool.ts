import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly retainedMasses: readonly number[];
  readonly initialMass: number;
};
export type Output = {
  readonly fractions: readonly number[];
  readonly cumulativeRetained: readonly number[];
  readonly unaccountedMass: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    retainedMasses: { type: "array", maxItems: 256, items: { type: "number" } },
    initialMass: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["retainedMasses", "initialMass"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fractions: { type: "array", maxItems: 256, items: { type: "number" } },
    cumulativeRetained: {
      type: "array",
      maxItems: 256,
      items: { type: "number" },
    },
    unaccountedMass: { type: "number" },
  },
  required: ["fractions", "cumulativeRetained", "unaccountedMass"],
} as const;
/** Calculate medicinal plant powder sieve fraction from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { retainedMasses, initialMass } = request;
  const compute = (): Output => {
    H.positive(initialMass);
    H.domain(
      retainedMasses.every((x) => x >= 0) &&
        retainedMasses.reduce((a, b) => a + b, 0) <= initialMass,
    );
    return {
      fractions: retainedMasses.map((x) => x / initialMass),
      cumulativeRetained: retainedMasses.map(
        (_, i) =>
          retainedMasses.slice(0, i + 1).reduce((a, b) => a + b, 0) /
          initialMass,
      ),
      unaccountedMass: initialMass - retainedMasses.reduce((a, b) => a + b, 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { retainedMasses: [20, 30, 40], initialMass: 100 },
  output: {
    fractions: [0.2, 0.3, 0.4],
    cumulativeRetained: [0.2, 0.5, 0.9],
    unaccountedMass: 10,
  },
} satisfies ToolExample<Input, Output>;
export const medicinalPlantPowderSieveFractionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacognosy/medicinal-plant-powder-sieve-fraction",
    title: "Medicinal Plant Powder Sieve Fraction Tool",
    description:
      "Calculate medicinal plant powder sieve fraction from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        retainedMasses: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        initialMass: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["retainedMasses", "initialMass"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fractions: { type: "array", maxItems: 256, items: { type: "number" } },
        cumulativeRetained: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        unaccountedMass: { type: "number" },
      },
      required: ["fractions", "cumulativeRetained", "unaccountedMass"],
    },
    ports: {
      inputs: [
        {
          id: "retainedMasses",
          label: "Retained Masses",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "initialMass",
          label: "Initial Mass",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "fractions",
          label: "Fractions",
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "cumulativeRetained",
          label: "Cumulative Retained",
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "unaccountedMass",
          label: "Unaccounted Mass",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = medicinalPlantPowderSieveFractionTool.execute;
export default medicinalPlantPowderSieveFractionTool;
