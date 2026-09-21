import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly area: number;
  readonly referenceYield: number;
  readonly supportPerUnit: number;
  readonly eligibleFraction: number;
};
export type Output = {
  readonly referenceQuantity: number;
  readonly support: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    area: { type: "number", minimum: 0 },
    referenceYield: { type: "number", minimum: 0 },
    supportPerUnit: { type: "number", minimum: 0 },
    eligibleFraction: { type: "number", minimum: 0, maximum: 1 },
  },
  required: ["area", "referenceYield", "supportPerUnit", "eligibleFraction"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    referenceQuantity: { type: "number" },
    support: { type: "number" },
  },
  required: ["referenceQuantity", "support"],
} as const;
/** Calculate crop support reference yield factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { area, referenceYield, supportPerUnit, eligibleFraction } = request;
  const compute = (): Output => {
    H.domain(area >= 0 && referenceYield >= 0 && supportPerUnit >= 0);
    H.probability(eligibleFraction);
    return {
      referenceQuantity: area * referenceYield * eligibleFraction,
      support: area * referenceYield * eligibleFraction * supportPerUnit,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    area: 10,
    referenceYield: 4,
    supportPerUnit: 20,
    eligibleFraction: 0.5,
  },
  output: { referenceQuantity: 20, support: 400 },
} satisfies ToolExample<Input, Output>;
export const cropSupportReferenceYieldFactorTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-policy/crop-support-reference-yield-factor",
    title: "Crop Support Reference Yield Factor Tool",
    description:
      "Calculate crop support reference yield factor from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        area: { type: "number", minimum: 0 },
        referenceYield: { type: "number", minimum: 0 },
        supportPerUnit: { type: "number", minimum: 0 },
        eligibleFraction: { type: "number", minimum: 0, maximum: 1 },
      },
      required: [
        "area",
        "referenceYield",
        "supportPerUnit",
        "eligibleFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        referenceQuantity: { type: "number" },
        support: { type: "number" },
      },
      required: ["referenceQuantity", "support"],
    },
    ports: {
      inputs: [
        {
          id: "area",
          label: "Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "referenceYield",
          label: "Reference Yield",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "supportPerUnit",
          label: "Support Per Unit",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "eligibleFraction",
          label: "Eligible Fraction",
          required: true,
          valueType: { type: "number", unit: "1" },
        },
      ],
      outputs: [
        {
          id: "referenceQuantity",
          label: "Reference Quantity",
          valueType: { type: "number" },
        },
        { id: "support", label: "Support", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = cropSupportReferenceYieldFactorTool.execute;
export default cropSupportReferenceYieldFactorTool;
