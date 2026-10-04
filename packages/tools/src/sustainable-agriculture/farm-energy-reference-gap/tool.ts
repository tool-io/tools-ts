import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly energyInputs: readonly number[];
  readonly sourceFactors: readonly number[];
  readonly referenceEnergy: number;
  readonly creditedExports: number;
};
export type Output = {
  readonly commonEnergy: number;
  readonly netEnergy: number;
  readonly referenceGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    energyInputs: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    sourceFactors: { type: "array", maxItems: 256, items: { type: "number" } },
    referenceEnergy: { type: "number" },
    creditedExports: { type: "number", minimum: 0 },
  },
  required: [
    "energyInputs",
    "sourceFactors",
    "referenceEnergy",
    "creditedExports",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    commonEnergy: { type: "number" },
    netEnergy: { type: "number" },
    referenceGap: { type: "number" },
  },
  required: ["commonEnergy", "netEnergy", "referenceGap"],
} as const;
/** Calculate farm energy reference gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { energyInputs, sourceFactors, referenceEnergy, creditedExports } =
    request;
  const compute = (): Output => {
    H.sameLength(energyInputs, sourceFactors);
    H.domain(
      energyInputs.every((x) => x >= 0) &&
        sourceFactors.every((x) => x > 0) &&
        creditedExports >= 0,
    );
    return (() => {
      const commonEnergy = energyInputs.reduce(
          (s, x, i) => s + x * sourceFactors[i],
          0,
        ),
        netEnergy = commonEnergy - creditedExports;
      return {
        commonEnergy,
        netEnergy,
        referenceGap: netEnergy - referenceEnergy,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    energyInputs: [2, 3],
    sourceFactors: [4, 2],
    referenceEnergy: 10,
    creditedExports: 1,
  },
  output: { commonEnergy: 14, netEnergy: 13, referenceGap: 3 },
} satisfies ToolExample<Input, Output>;
export const farmEnergyReferenceGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "sustainable-agriculture/farm-energy-reference-gap",
    title: "Farm Energy Reference Gap Tool",
    description:
      "Calculate farm energy reference gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        energyInputs: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        sourceFactors: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        referenceEnergy: { type: "number" },
        creditedExports: { type: "number", minimum: 0 },
      },
      required: [
        "energyInputs",
        "sourceFactors",
        "referenceEnergy",
        "creditedExports",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        commonEnergy: { type: "number" },
        netEnergy: { type: "number" },
        referenceGap: { type: "number" },
      },
      required: ["commonEnergy", "netEnergy", "referenceGap"],
    },
    ports: {
      inputs: [
        {
          id: "energyInputs",
          label: "Energy Inputs",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "sourceFactors",
          label: "Source Factors",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "referenceEnergy",
          label: "Reference Energy",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "creditedExports",
          label: "Credited Exports",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "commonEnergy",
          label: "Common Energy",
          valueType: { type: "number" },
        },
        { id: "netEnergy", label: "Net Energy", valueType: { type: "number" } },
        {
          id: "referenceGap",
          label: "Reference Gap",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = farmEnergyReferenceGapTool.execute;
export default farmEnergyReferenceGapTool;
