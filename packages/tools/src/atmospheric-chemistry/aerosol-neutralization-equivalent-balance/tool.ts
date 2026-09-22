import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cationMoles: readonly number[];
  readonly cationCharges: readonly number[];
  readonly anionMoles: readonly number[];
  readonly anionChargeMagnitudes: readonly number[];
};
export type Output = {
  readonly positiveEquivalents: number;
  readonly negativeEquivalents: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cationMoles: { type: "array", maxItems: 256, items: { type: "number" } },
    cationCharges: { type: "array", maxItems: 256, items: { type: "integer" } },
    anionMoles: { type: "array", maxItems: 256, items: { type: "number" } },
    anionChargeMagnitudes: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: [
    "cationMoles",
    "cationCharges",
    "anionMoles",
    "anionChargeMagnitudes",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    positiveEquivalents: { type: "number" },
    negativeEquivalents: { type: "number" },
    residual: { type: "number" },
  },
  required: ["positiveEquivalents", "negativeEquivalents", "residual"],
} as const;
/** Calculate aerosol neutralization equivalent balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cationMoles, cationCharges, anionMoles, anionChargeMagnitudes } =
    request;
  const compute = (): Output => {
    H.sameLength(cationMoles, cationCharges);
    H.sameLength(anionMoles, anionChargeMagnitudes);
    H.domain(
      cationMoles.every((x) => x >= 0) &&
        anionMoles.every((x) => x >= 0) &&
        cationCharges.every((x) => x > 0) &&
        anionChargeMagnitudes.every((x) => x > 0),
    );
    return {
      positiveEquivalents: H.dot(cationMoles, cationCharges),
      negativeEquivalents: H.dot(anionMoles, anionChargeMagnitudes),
      residual:
        H.dot(cationMoles, cationCharges) -
        H.dot(anionMoles, anionChargeMagnitudes),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    cationMoles: [2],
    cationCharges: [1],
    anionMoles: [1],
    anionChargeMagnitudes: [2],
  },
  output: { positiveEquivalents: 2, negativeEquivalents: 2, residual: 0 },
} satisfies ToolExample<Input, Output>;
export const aerosolNeutralizationEquivalentBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "atmospheric-chemistry/aerosol-neutralization-equivalent-balance",
      title: "Aerosol Neutralization Equivalent Balance Tool",
      description:
        "Calculate aerosol neutralization equivalent balance from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          cationMoles: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          cationCharges: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
          anionMoles: {
            type: "array",
            maxItems: 256,
            items: { type: "number" },
          },
          anionChargeMagnitudes: {
            type: "array",
            maxItems: 256,
            items: { type: "integer" },
          },
        },
        required: [
          "cationMoles",
          "cationCharges",
          "anionMoles",
          "anionChargeMagnitudes",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          positiveEquivalents: { type: "number" },
          negativeEquivalents: { type: "number" },
          residual: { type: "number" },
        },
        required: ["positiveEquivalents", "negativeEquivalents", "residual"],
      },
      ports: {
        inputs: [
          {
            id: "cationMoles",
            label: "Cation Moles",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "cationCharges",
            label: "Cation Charges",
            required: true,
            valueType: { type: "list", items: { type: "integer" } },
          },
          {
            id: "anionMoles",
            label: "Anion Moles",
            required: true,
            valueType: { type: "list", items: { type: "number" } },
          },
          {
            id: "anionChargeMagnitudes",
            label: "Anion Charge Magnitudes",
            required: true,
            valueType: { type: "list", items: { type: "integer" } },
          },
        ],
        outputs: [
          {
            id: "positiveEquivalents",
            label: "Positive Equivalents",
            valueType: { type: "number" },
          },
          {
            id: "negativeEquivalents",
            label: "Negative Equivalents",
            valueType: { type: "number" },
          },
          { id: "residual", label: "Residual", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = aerosolNeutralizationEquivalentBalanceTool.execute;
export default aerosolNeutralizationEquivalentBalanceTool;
