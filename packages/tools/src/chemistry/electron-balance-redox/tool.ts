import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type ElectronBalanceRedoxInput = {
  readonly totalOxidationElectrons: number;
  readonly totalReductionElectrons: number;
};

export type ElectronBalanceRedoxOutput = {
  readonly balanced: boolean;
  readonly electronDifference: number;
};

export const electronBalanceRedoxExample = {
  input: { totalOxidationElectrons: 6, totalReductionElectrons: 6 },
  output: { balanced: true, electronDifference: 0 },
} satisfies ToolExample<ElectronBalanceRedoxInput, ElectronBalanceRedoxOutput>;

export const electronBalanceRedoxTool = createSimpleTool({
  id: "chemistry/electron-balance-redox",
  title: "Electron Balance Check",
  description:
    "Check whether total electrons lost in oxidation equal total electrons gained in reduction and report the signed difference.",
  inputs: [
    {
      id: "totalOxidationElectrons",
      label: "Oxidation electrons",
      kind: "integer",
      maximum: 20,
      minimum: 1,
    },
    {
      id: "totalReductionElectrons",
      label: "Reduction electrons",
      kind: "integer",
      maximum: 20,
      minimum: 1,
    },
  ],
  outputs: [
    { id: "balanced", label: "Balanced", kind: "boolean" },
    {
      id: "electronDifference",
      label: "Electron difference",
      kind: "integer",
    },
  ],
  calculate: (input) => {
    const electronDifference =
      (input.totalOxidationElectrons as number) -
      (input.totalReductionElectrons as number);
    return {
      balanced: electronDifference === 0,
      electronDifference,
    };
  },
});
export const runElectronBalanceRedox = electronBalanceRedoxTool.execute;
export default electronBalanceRedoxTool;
