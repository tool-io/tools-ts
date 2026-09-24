import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly atomicNumbers: readonly number[];
  readonly atomCounts: readonly number[];
  readonly netCharge: number;
  readonly suppliedElectrons: string;
};
export type Output = {
  readonly nuclearChargeDecimal: string;
  readonly expectedElectronsDecimal: string;
  readonly residualDecimal: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    atomicNumbers: { type: "array", maxItems: 256, items: { type: "integer" } },
    atomCounts: {
      type: "array",
      maxItems: 256,
      items: { type: "integer", minimum: 0 },
    },
    netCharge: { type: "integer" },
    suppliedElectrons: { type: "string", maxLength: 8192 },
  },
  required: ["atomicNumbers", "atomCounts", "netCharge", "suppliedElectrons"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nuclearChargeDecimal: { type: "string", maxLength: 8192 },
    expectedElectronsDecimal: { type: "string", maxLength: 8192 },
    residualDecimal: { type: "string", maxLength: 8192 },
  },
  required: [
    "nuclearChargeDecimal",
    "expectedElectronsDecimal",
    "residualDecimal",
  ],
} as const;
/** Balance exact supplied atomic numbers, counts and charge against a decimal electron-count witness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { atomicNumbers, atomCounts, netCharge, suppliedElectrons } = request;
  const compute = (): Output => {
    H.sameLength(atomicNumbers, atomCounts);
    H.domain(
      atomicNumbers.every((x) => x >= 1) && atomCounts.every((x) => x >= 0),
    );
    const nuclear = atomicNumbers.reduce(
        (s, x, i) => s + BigInt(x) * BigInt(atomCounts[i]),
        0n,
      ),
      expected = nuclear - BigInt(netCharge),
      actual = H.decimal(suppliedElectrons);
    H.domain(expected >= 0n && actual >= 0n);
    return {
      nuclearChargeDecimal: nuclear.toString(),
      expectedElectronsDecimal: expected.toString(),
      residualDecimal: (actual - expected).toString(),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    atomicNumbers: [6, 1],
    atomCounts: [1, 4],
    netCharge: 1,
    suppliedElectrons: "9",
  },
  output: {
    nuclearChargeDecimal: "10",
    expectedElectronsDecimal: "9",
    residualDecimal: "0",
  },
} satisfies ToolExample<Input, Output>;
export const nuclearChargeElectronBalanceTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-chemistry/nuclear-charge-electron-balance",
    title: "Nuclear Charge Electron Balance Tool",
    description:
      "Balance exact supplied atomic numbers, counts and charge against a decimal electron-count witness.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        atomicNumbers: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        atomCounts: {
          type: "array",
          maxItems: 256,
          items: { type: "integer", minimum: 0 },
        },
        netCharge: { type: "integer" },
        suppliedElectrons: { type: "string", maxLength: 8192 },
      },
      required: [
        "atomicNumbers",
        "atomCounts",
        "netCharge",
        "suppliedElectrons",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        nuclearChargeDecimal: { type: "string", maxLength: 8192 },
        expectedElectronsDecimal: { type: "string", maxLength: 8192 },
        residualDecimal: { type: "string", maxLength: 8192 },
      },
      required: [
        "nuclearChargeDecimal",
        "expectedElectronsDecimal",
        "residualDecimal",
      ],
    },
    ports: {
      inputs: [
        {
          id: "atomicNumbers",
          label: "Atomic Numbers",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "atomCounts",
          label: "Atom Counts",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "netCharge",
          label: "Net Charge",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "suppliedElectrons",
          label: "Supplied Electrons",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "nuclearChargeDecimal",
          label: "Nuclear Charge Decimal",
          valueType: { type: "string" },
        },
        {
          id: "expectedElectronsDecimal",
          label: "Expected Electrons Decimal",
          valueType: { type: "string" },
        },
        {
          id: "residualDecimal",
          label: "Residual Decimal",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = nuclearChargeElectronBalanceTool.execute;
export default nuclearChargeElectronBalanceTool;
