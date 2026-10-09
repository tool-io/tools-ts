import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly serviceUnits: number;
  readonly suppliedBenefitPerUnit: number;
};
export type Output = { readonly benefit: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    serviceUnits: { type: "number", minimum: 0 },
    suppliedBenefitPerUnit: { type: "number" },
  },
  required: ["serviceUnits", "suppliedBenefitPerUnit"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { benefit: { type: "number" } },
  required: ["benefit"],
} as const;
/** Multiply explicit ecosystem-service units by a supplied signed per-unit valuation without choosing a valuation method. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { serviceUnits, suppliedBenefitPerUnit } = request;
  const compute = (): Output => {
    H.domain(serviceUnits >= 0, "serviceUnits");
    return { benefit: serviceUnits * suppliedBenefitPerUnit };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { serviceUnits: 25, suppliedBenefitPerUnit: 40 },
  output: { benefit: 1000 },
} satisfies ToolExample<Input, Output>;
export const ecosystemServiceUnitBenefitTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "environmental-economics",
        "environmental economics",
        "economics",
      ],
      keywords: ["environmental economics", "economics"],
    },
    id: "environmental-economics/ecosystem-service-unit-benefit",
    title: "Ecosystem Service Unit Benefit",
    description:
      "Multiply explicit ecosystem-service units by a supplied signed per-unit valuation without choosing a valuation method.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        serviceUnits: { type: "number", minimum: 0 },
        suppliedBenefitPerUnit: { type: "number" },
      },
      required: ["serviceUnits", "suppliedBenefitPerUnit"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { benefit: { type: "number" } },
      required: ["benefit"],
    },
    ports: {
      inputs: [
        {
          id: "serviceUnits",
          label: "Service Units",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedBenefitPerUnit",
          label: "Supplied Benefit Per Unit",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "benefit", label: "Benefit", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = ecosystemServiceUnitBenefitTool.execute;
export default ecosystemServiceUnitBenefitTool;
