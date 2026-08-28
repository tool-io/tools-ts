import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";
export const RealGasCorrectionBTool = createSimpleTool({
  id: "chemistry/real-gas-correction-b",
  title: "Real Gas Correction B Calculator",
  description: "Compute excluded volume n*b from van der Waals constant b.",
  inputs: [
    {
      id: "bLPerMol",
      label: "b constant",
      kind: "number",
      minimum: 0,
      unit: "L/mol",
    },
    { id: "moles", label: "Moles", kind: "number", minimum: 0 },
  ],
  outputs: [
    {
      id: "excludedVolumeL",
      label: "Excluded volume",
      kind: "number",
      unit: "L",
    },
  ],
  calculate: (input) => {
    return {
      excludedVolumeL: (input.bLPerMol as number) * (input.moles as number),
    };
  },
});
export default RealGasCorrectionBTool;
export const runRealGasCorrectionB = RealGasCorrectionBTool.execute;

export type RealGasCorrectionBInput = {
  readonly bLPerMol: number;
  readonly moles: number;
};

export type RealGasCorrectionBOutput = {
  readonly excludedVolumeL: number;
};

export const realGasCorrectionBExample = {
  input: {
    bLPerMol: 1,
    moles: 1,
  },
  output: {
    excludedVolumeL: 1,
  },
} satisfies ToolExample<RealGasCorrectionBInput, RealGasCorrectionBOutput>;
