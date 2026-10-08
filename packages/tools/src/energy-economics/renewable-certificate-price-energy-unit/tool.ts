import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coveredEnergy: number;
  readonly energyPerCertificate: number;
  readonly certificatePrice: number;
};
export type Output = {
  readonly certificateEquivalent: number;
  readonly cost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coveredEnergy: { type: "number", minimum: 0 },
    energyPerCertificate: { type: "number", exclusiveMinimum: 0 },
    certificatePrice: { type: "number" },
  },
  required: ["coveredEnergy", "energyPerCertificate", "certificatePrice"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    certificateEquivalent: { type: "number" },
    cost: { type: "number" },
  },
  required: ["certificateEquivalent", "cost"],
} as const;
/** Convert supplied energy into fractional certificate equivalents and explicit price cost without whole-certificate settlement or eligibility rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coveredEnergy, energyPerCertificate, certificatePrice } = request;
  const compute = (): Output => {
    H.domain(coveredEnergy >= 0, "coveredEnergy");
    (H.domain(
      Number.isFinite(energyPerCertificate) && energyPerCertificate > 0,
      "energyPerCertificate",
    ),
      energyPerCertificate);
    return {
      certificateEquivalent: coveredEnergy / energyPerCertificate,
      cost: (coveredEnergy / energyPerCertificate) * certificatePrice,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    coveredEnergy: 1500,
    energyPerCertificate: 1000,
    certificatePrice: 20,
  },
  output: { certificateEquivalent: 1.5, cost: 30 },
} satisfies ToolExample<Input, Output>;
export const renewableCertificatePriceEnergyUnitTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "energy-economics/renewable-certificate-price-energy-unit",
      title: "Renewable Certificate Price Energy Unit Tool",
      description:
        "Convert supplied energy into fractional certificate equivalents and explicit price cost without whole-certificate settlement or eligibility rules.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          coveredEnergy: { type: "number", minimum: 0 },
          energyPerCertificate: { type: "number", exclusiveMinimum: 0 },
          certificatePrice: { type: "number" },
        },
        required: ["coveredEnergy", "energyPerCertificate", "certificatePrice"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          certificateEquivalent: { type: "number" },
          cost: { type: "number" },
        },
        required: ["certificateEquivalent", "cost"],
      },
      ports: {
        inputs: [
          {
            id: "coveredEnergy",
            label: "Covered Energy",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "energyPerCertificate",
            label: "Energy Per Certificate",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "certificatePrice",
            label: "Certificate Price",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "certificateEquivalent",
            label: "Certificate Equivalent",
            valueType: { type: "number" },
          },
          { id: "cost", label: "Cost", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = renewableCertificatePriceEnergyUnitTool.execute;
export default renewableCertificatePriceEnergyUnitTool;
