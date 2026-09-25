import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly transferredEnergy: number;
  readonly grossEnergy: number;
  readonly assimilatedEnergy: number;
  readonly useAssimilated: boolean;
};
export type Output = {
  readonly fraction: number;
  readonly denominator: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    transferredEnergy: { type: "number", minimum: 0 },
    grossEnergy: { type: "number", exclusiveMinimum: 0 },
    assimilatedEnergy: { type: "number", exclusiveMinimum: 0 },
    useAssimilated: { type: "boolean" },
  },
  required: [
    "transferredEnergy",
    "grossEnergy",
    "assimilatedEnergy",
    "useAssimilated",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { fraction: { type: "number" }, denominator: { type: "number" } },
  required: ["fraction", "denominator"],
} as const;
/** Calculate trophic transfer reference base from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { transferredEnergy, grossEnergy, assimilatedEnergy, useAssimilated } =
    request;
  const compute = (): Output => {
    H.positive(grossEnergy);
    H.positive(assimilatedEnergy);
    H.domain(
      transferredEnergy >= 0 &&
        transferredEnergy <= assimilatedEnergy &&
        assimilatedEnergy <= grossEnergy,
    );
    return {
      fraction:
        transferredEnergy / (useAssimilated ? assimilatedEnergy : grossEnergy),
      denominator: useAssimilated ? assimilatedEnergy : grossEnergy,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    transferredEnergy: 10,
    grossEnergy: 100,
    assimilatedEnergy: 40,
    useAssimilated: true,
  },
  output: { fraction: 0.25, denominator: 40 },
} satisfies ToolExample<Input, Output>;
export const trophicTransferReferenceBaseTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ecology/trophic-transfer-reference-base",
    title: "Trophic Transfer Reference Base Tool",
    description:
      "Calculate trophic transfer reference base from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        transferredEnergy: { type: "number", minimum: 0 },
        grossEnergy: { type: "number", exclusiveMinimum: 0 },
        assimilatedEnergy: { type: "number", exclusiveMinimum: 0 },
        useAssimilated: { type: "boolean" },
      },
      required: [
        "transferredEnergy",
        "grossEnergy",
        "assimilatedEnergy",
        "useAssimilated",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fraction: { type: "number" },
        denominator: { type: "number" },
      },
      required: ["fraction", "denominator"],
    },
    ports: {
      inputs: [
        {
          id: "transferredEnergy",
          label: "Transferred Energy",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "grossEnergy",
          label: "Gross Energy",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "assimilatedEnergy",
          label: "Assimilated Energy",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "useAssimilated",
          label: "Use Assimilated",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        { id: "fraction", label: "Fraction", valueType: { type: "number" } },
        {
          id: "denominator",
          label: "Denominator",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = trophicTransferReferenceBaseTool.execute;
export default trophicTransferReferenceBaseTool;
