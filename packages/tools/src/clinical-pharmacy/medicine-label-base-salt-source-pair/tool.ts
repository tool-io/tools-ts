import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly baseName: string;
  readonly saltName: string;
  readonly sourceId: string;
  readonly sourceEdition: string;
  readonly suppliedBaseFraction: number;
};
export type Output = { readonly key: string; readonly fraction: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    baseName: { type: "string", maxLength: 8192 },
    saltName: { type: "string", maxLength: 8192 },
    sourceId: { type: "string", maxLength: 8192 },
    sourceEdition: { type: "string", maxLength: 8192 },
    suppliedBaseFraction: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: [
    "baseName",
    "saltName",
    "sourceId",
    "sourceEdition",
    "suppliedBaseFraction",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    key: { type: "string", maxLength: 8192 },
    fraction: { type: "number" },
  },
  required: ["key", "fraction"],
} as const;
/** Retain a supplied base/salt conversion fraction and its explicit attribution. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { baseName, saltName, sourceId, sourceEdition, suppliedBaseFraction } =
    request;
  const compute = (): Output => {
    H.domain(
      [baseName, saltName, sourceId, sourceEdition].every((x) => x.length > 0),
    );
    H.domain(suppliedBaseFraction > 0 && suppliedBaseFraction <= 1);
    return {
      key: JSON.stringify([baseName, saltName, sourceId, sourceEdition]),
      fraction: suppliedBaseFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    baseName: "base-A",
    saltName: "salt-A",
    sourceId: "source-A",
    sourceEdition: "v1",
    suppliedBaseFraction: 0.8,
  },
  output: { key: '["base-A","salt-A","source-A","v1"]', fraction: 0.8 },
} satisfies ToolExample<Input, Output>;
export const medicineLabelBaseSaltSourcePairTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "clinical-pharmacy/medicine-label-base-salt-source-pair",
    title: "Medicine Label Base Salt Source Pair Tool",
    description:
      "Retain a supplied base/salt conversion fraction and its explicit attribution.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        baseName: { type: "string", maxLength: 8192 },
        saltName: { type: "string", maxLength: 8192 },
        sourceId: { type: "string", maxLength: 8192 },
        sourceEdition: { type: "string", maxLength: 8192 },
        suppliedBaseFraction: {
          type: "number",
          exclusiveMinimum: 0,
          maximum: 1,
        },
      },
      required: [
        "baseName",
        "saltName",
        "sourceId",
        "sourceEdition",
        "suppliedBaseFraction",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        key: { type: "string", maxLength: 8192 },
        fraction: { type: "number" },
      },
      required: ["key", "fraction"],
    },
    ports: {
      inputs: [
        {
          id: "baseName",
          label: "Base Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "saltName",
          label: "Salt Name",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceId",
          label: "Source Id",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "sourceEdition",
          label: "Source Edition",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedBaseFraction",
          label: "Supplied Base Fraction",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "key", label: "Key", valueType: { type: "string" } },
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = medicineLabelBaseSaltSourcePairTool.execute;
export default medicineLabelBaseSaltSourcePairTool;
