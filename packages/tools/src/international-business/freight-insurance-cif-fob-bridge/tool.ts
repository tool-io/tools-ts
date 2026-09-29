import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fobValue: number;
  readonly freight: number;
  readonly insuranceRate: number;
  readonly coverageUplift: number;
  readonly insuredOnCif: boolean;
};
export type Output = { readonly insurance: number; readonly cifValue: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fobValue: { type: "number", minimum: 0 },
    freight: { type: "number", minimum: 0 },
    insuranceRate: { type: "number", minimum: 0 },
    coverageUplift: { type: "number", minimum: 0 },
    insuredOnCif: { type: "boolean" },
  },
  required: [
    "fobValue",
    "freight",
    "insuranceRate",
    "coverageUplift",
    "insuredOnCif",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { insurance: { type: "number" }, cifValue: { type: "number" } },
  required: ["insurance", "cifValue"],
} as const;
/** Cost bridge with an explicit insurance basis; insured-on-CIF solves the circular premium algebra and does not choose Incoterms obligations. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fobValue, freight, insuranceRate, coverageUplift, insuredOnCif } =
    request;
  const compute = (): Output => {
    H.domain(
      fobValue >= 0 &&
        freight >= 0 &&
        insuranceRate >= 0 &&
        coverageUplift >= 0 &&
        insuranceRate * coverageUplift < 1,
    );
    return {
      insurance: insuredOnCif
        ? ((fobValue + freight) * insuranceRate * coverageUplift) /
          (1 - insuranceRate * coverageUplift)
        : (fobValue + freight) * insuranceRate * coverageUplift,
      cifValue: insuredOnCif
        ? (fobValue + freight) / (1 - insuranceRate * coverageUplift)
        : (fobValue + freight) * (1 + insuranceRate * coverageUplift),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    fobValue: 1000,
    freight: 200,
    insuranceRate: 0.01,
    coverageUplift: 1.1,
    insuredOnCif: false,
  },
  output: { insurance: 13.200000000000001, cifValue: 1213.1999999999998 },
} satisfies ToolExample<Input, Output>;
export const freightInsuranceCifFobBridgeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "international-business/freight-insurance-cif-fob-bridge",
    title: "Freight Insurance CIF FOB Bridge Tool",
    description:
      "Cost bridge with an explicit insurance basis; insured-on-CIF solves the circular premium algebra and does not choose Incoterms obligations.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fobValue: { type: "number", minimum: 0 },
        freight: { type: "number", minimum: 0 },
        insuranceRate: { type: "number", minimum: 0 },
        coverageUplift: { type: "number", minimum: 0 },
        insuredOnCif: { type: "boolean" },
      },
      required: [
        "fobValue",
        "freight",
        "insuranceRate",
        "coverageUplift",
        "insuredOnCif",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        insurance: { type: "number" },
        cifValue: { type: "number" },
      },
      required: ["insurance", "cifValue"],
    },
    ports: {
      inputs: [
        {
          id: "fobValue",
          label: "Fob Value",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "freight",
          label: "Freight",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "insuranceRate",
          label: "Insurance Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "coverageUplift",
          label: "Coverage Uplift",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "insuredOnCif",
          label: "Insured On Cif",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "insurance", label: "Insurance", valueType: { type: "number" } },
        { id: "cifValue", label: "Cif Value", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = freightInsuranceCifFobBridgeTool.execute;
export default freightInsuranceCifFobBridgeTool;
