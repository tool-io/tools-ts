import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cartons: number;
  readonly netPerCarton: number;
  readonly tarePerCarton: number;
  readonly declaredGross: number;
};
export type Output = {
  readonly calculatedNet: number;
  readonly calculatedGross: number;
  readonly discrepancy: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cartons: { type: "integer", minimum: 0 },
    netPerCarton: { type: "number", minimum: 0 },
    tarePerCarton: { type: "number", minimum: 0 },
    declaredGross: { type: "number", minimum: 0 },
  },
  required: ["cartons", "netPerCarton", "tarePerCarton", "declaredGross"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    calculatedNet: { type: "number" },
    calculatedGross: { type: "number" },
    discrepancy: { type: "number" },
  },
  required: ["calculatedNet", "calculatedGross", "discrepancy"],
} as const;
/** Calculate export carton document weight reconcile from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { cartons, netPerCarton, tarePerCarton, declaredGross } = request;
  const compute = (): Output => {
    H.integer(cartons, 0);
    H.domain(netPerCarton >= 0 && tarePerCarton >= 0 && declaredGross >= 0);
    return {
      calculatedNet: cartons * netPerCarton,
      calculatedGross: cartons * (netPerCarton + tarePerCarton),
      discrepancy: declaredGross - cartons * (netPerCarton + tarePerCarton),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    cartons: 20,
    netPerCarton: 10,
    tarePerCarton: 1,
    declaredGross: 225,
  },
  output: { calculatedNet: 200, calculatedGross: 220, discrepancy: 5 },
} satisfies ToolExample<Input, Output>;
export const exportCartonDocumentWeightReconcileTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "international-business/export-carton-document-weight-reconcile",
      title: "Export Carton Document Weight Reconcile Tool",
      description:
        "Calculate export carton document weight reconcile from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          cartons: { type: "integer", minimum: 0 },
          netPerCarton: { type: "number", minimum: 0 },
          tarePerCarton: { type: "number", minimum: 0 },
          declaredGross: { type: "number", minimum: 0 },
        },
        required: ["cartons", "netPerCarton", "tarePerCarton", "declaredGross"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          calculatedNet: { type: "number" },
          calculatedGross: { type: "number" },
          discrepancy: { type: "number" },
        },
        required: ["calculatedNet", "calculatedGross", "discrepancy"],
      },
      ports: {
        inputs: [
          {
            id: "cartons",
            label: "Cartons",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "netPerCarton",
            label: "Net Per Carton",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "tarePerCarton",
            label: "Tare Per Carton",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "declaredGross",
            label: "Declared Gross",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "calculatedNet",
            label: "Calculated Net",
            valueType: { type: "number" },
          },
          {
            id: "calculatedGross",
            label: "Calculated Gross",
            valueType: { type: "number" },
          },
          {
            id: "discrepancy",
            label: "Discrepancy",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = exportCartonDocumentWeightReconcileTool.execute;
export default exportCartonDocumentWeightReconcileTool;
