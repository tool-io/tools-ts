import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly product: string;
  readonly serial: string;
  readonly lot: string;
  readonly expectedProduct: string;
  readonly expectedSerial: string;
  readonly expectedLot: string;
};
export type Output = {
  readonly productMatch: boolean;
  readonly serialMatch: boolean;
  readonly lotMatch: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    product: { type: "string", maxLength: 8192 },
    serial: { type: "string", maxLength: 8192 },
    lot: { type: "string", maxLength: 8192 },
    expectedProduct: { type: "string", maxLength: 8192 },
    expectedSerial: { type: "string", maxLength: 8192 },
    expectedLot: { type: "string", maxLength: 8192 },
  },
  required: [
    "product",
    "serial",
    "lot",
    "expectedProduct",
    "expectedSerial",
    "expectedLot",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    productMatch: { type: "boolean" },
    serialMatch: { type: "boolean" },
    lotMatch: { type: "boolean" },
  },
  required: ["productMatch", "serialMatch", "lotMatch"],
} as const;
/** Compare explicit serialized pack identifiers exactly, retaining leading zeros. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { product, serial, lot, expectedProduct, expectedSerial, expectedLot } =
    request;
  const compute = (): Output => {
    H.domain(
      [
        product,
        serial,
        lot,
        expectedProduct,
        expectedSerial,
        expectedLot,
      ].every((x) => x.length > 0),
    );
    return {
      productMatch: product === expectedProduct,
      serialMatch: serial === expectedSerial,
      lotMatch: lot === expectedLot,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    product: "P",
    serial: "001",
    lot: "L",
    expectedProduct: "P",
    expectedSerial: "001",
    expectedLot: "L",
  },
  output: { productMatch: true, serialMatch: true, lotMatch: true },
} satisfies ToolExample<Input, Output>;
export const medicineSerializedPackReferenceCheckTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "community-pharmacy/medicine-serialized-pack-reference-check",
      title: "Medicine Serialized Pack Reference Check Tool",
      description:
        "Compare explicit serialized pack identifiers exactly, retaining leading zeros.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          product: { type: "string", maxLength: 8192 },
          serial: { type: "string", maxLength: 8192 },
          lot: { type: "string", maxLength: 8192 },
          expectedProduct: { type: "string", maxLength: 8192 },
          expectedSerial: { type: "string", maxLength: 8192 },
          expectedLot: { type: "string", maxLength: 8192 },
        },
        required: [
          "product",
          "serial",
          "lot",
          "expectedProduct",
          "expectedSerial",
          "expectedLot",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          productMatch: { type: "boolean" },
          serialMatch: { type: "boolean" },
          lotMatch: { type: "boolean" },
        },
        required: ["productMatch", "serialMatch", "lotMatch"],
      },
      ports: {
        inputs: [
          {
            id: "product",
            label: "Product",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "serial",
            label: "Serial",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "lot",
            label: "Lot",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "expectedProduct",
            label: "Expected Product",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "expectedSerial",
            label: "Expected Serial",
            required: true,
            valueType: { type: "string" },
          },
          {
            id: "expectedLot",
            label: "Expected Lot",
            required: true,
            valueType: { type: "string" },
          },
        ],
        outputs: [
          {
            id: "productMatch",
            label: "Product Match",
            valueType: { type: "boolean" },
          },
          {
            id: "serialMatch",
            label: "Serial Match",
            valueType: { type: "boolean" },
          },
          {
            id: "lotMatch",
            label: "Lot Match",
            valueType: { type: "boolean" },
          },
        ],
      },
    },
    calculate,
  });
export const run = medicineSerializedPackReferenceCheckTool.execute;
export default medicineSerializedPackReferenceCheckTool;
