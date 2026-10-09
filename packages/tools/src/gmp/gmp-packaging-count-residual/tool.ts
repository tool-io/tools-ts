import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inputUnits: number;
  readonly packedUnits: number;
  readonly rejectedUnits: number;
  readonly sampledUnits: number;
};
export type Output = { readonly unaccountedUnits: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inputUnits: { type: "integer", minimum: 0 },
    packedUnits: { type: "integer", minimum: 0 },
    rejectedUnits: { type: "integer", minimum: 0 },
    sampledUnits: { type: "integer", minimum: 0 },
  },
  required: ["inputUnits", "packedUnits", "rejectedUnits", "sampledUnits"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { unaccountedUnits: { type: "integer" } },
  required: ["unaccountedUnits"],
} as const;
/** Reconcile explicit packaging counts with exact integer arithmetic and a signed residual without deciding batch disposition. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { inputUnits, packedUnits, rejectedUnits, sampledUnits } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(inputUnits) &&
        inputUnits >= 0 &&
        inputUnits <= Number.MAX_SAFE_INTEGER,
      "inputUnits",
    ),
      inputUnits);
    (H.domain(
      Number.isSafeInteger(packedUnits) &&
        packedUnits >= 0 &&
        packedUnits <= Number.MAX_SAFE_INTEGER,
      "packedUnits",
    ),
      packedUnits);
    (H.domain(
      Number.isSafeInteger(rejectedUnits) &&
        rejectedUnits >= 0 &&
        rejectedUnits <= Number.MAX_SAFE_INTEGER,
      "rejectedUnits",
    ),
      rejectedUnits);
    (H.domain(
      Number.isSafeInteger(sampledUnits) &&
        sampledUnits >= 0 &&
        sampledUnits <= Number.MAX_SAFE_INTEGER,
      "sampledUnits",
    ),
      sampledUnits);
    return {
      unaccountedUnits: Number(
        BigInt(inputUnits) -
          BigInt(packedUnits) -
          BigInt(rejectedUnits) -
          BigInt(sampledUnits),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    inputUnits: 1000,
    packedUnits: 970,
    rejectedUnits: 20,
    sampledUnits: 5,
  },
  output: { unaccountedUnits: 5 },
} satisfies ToolExample<Input, Output>;
export const gmpPackagingCountResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data"],
      fields: [
        "gmp",
        "good manufacturing practice",
        "research and quality management",
      ],
      keywords: [
        "good manufacturing practice",
        "research and quality management",
        "GMP",
      ],
    },
    id: "gmp/gmp-packaging-count-residual",
    title: "GMP Packaging Count Residual",
    description:
      "Reconcile explicit packaging counts with exact integer arithmetic and a signed residual without deciding batch disposition.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inputUnits: { type: "integer", minimum: 0 },
        packedUnits: { type: "integer", minimum: 0 },
        rejectedUnits: { type: "integer", minimum: 0 },
        sampledUnits: { type: "integer", minimum: 0 },
      },
      required: ["inputUnits", "packedUnits", "rejectedUnits", "sampledUnits"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { unaccountedUnits: { type: "integer" } },
      required: ["unaccountedUnits"],
    },
    ports: {
      inputs: [
        {
          id: "inputUnits",
          label: "Input Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "packedUnits",
          label: "Packed Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "rejectedUnits",
          label: "Rejected Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sampledUnits",
          label: "Sampled Units",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "unaccountedUnits",
          label: "Unaccounted Units",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = gmpPackagingCountResidualTool.execute;
export default gmpPackagingCountResidualTool;
