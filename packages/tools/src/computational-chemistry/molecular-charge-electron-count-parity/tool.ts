import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly atomicNumbers: readonly number[];
  readonly atomCounts: readonly number[];
  readonly netCharge: number;
};
export type Output = { readonly oddElectrons: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    atomicNumbers: { type: "array", maxItems: 256, items: { type: "integer" } },
    atomCounts: { type: "array", maxItems: 256, items: { type: "integer" } },
    netCharge: { type: "integer" },
  },
  required: ["atomicNumbers", "atomCounts", "netCharge"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { oddElectrons: { type: "boolean" } },
  required: ["oddElectrons"],
} as const;
/** Return only electron-count parity from supplied nuclear charges, atom counts and net charge; not a spin-state prediction. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { atomicNumbers, atomCounts, netCharge } = request;
  const compute = (): Output => {
    H.sameLength(atomicNumbers, atomCounts);
    H.domain(
      atomicNumbers.every((x) => x >= 1) && atomCounts.every((x) => x >= 0),
    );
    const electrons = atomicNumbers.reduce(
      (a, b, i) => a + BigInt(b) * BigInt(atomCounts[i]),
      -BigInt(netCharge),
    );
    H.domain(electrons >= 0n);
    return { oddElectrons: electrons % 2n === 1n };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { atomicNumbers: [6, 1], atomCounts: [1, 4], netCharge: 0 },
  output: { oddElectrons: false },
} satisfies ToolExample<Input, Output>;
export const molecularChargeElectronCountParityTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "computational-chemistry/molecular-charge-electron-count-parity",
    title: "Molecular Charge Electron Count Parity Tool",
    description:
      "Return only electron-count parity from supplied nuclear charges, atom counts and net charge; not a spin-state prediction.",
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
          items: { type: "integer" },
        },
        netCharge: { type: "integer" },
      },
      required: ["atomicNumbers", "atomCounts", "netCharge"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { oddElectrons: { type: "boolean" } },
      required: ["oddElectrons"],
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
      ],
      outputs: [
        {
          id: "oddElectrons",
          label: "Odd Electrons",
          valueType: { type: "boolean" },
        },
      ],
    },
  },
  calculate,
});
export const run = molecularChargeElectronCountParityTool.execute;
export default molecularChargeElectronCountParityTool;
