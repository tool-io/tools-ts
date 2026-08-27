import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StorativityConfinedInput = {
  readonly aquiferThicknessM: number;
  readonly specificStoragePerM: number;
};

export type StorativityConfinedOutput = {
  readonly storativity: number;
};

export const calculateStorativityConfined = (
  input: StorativityConfinedInput,
): StorativityConfinedOutput => {
  if (!(input.aquiferThicknessM > 0))
    simpleError(
      "aquiferThicknessM",
      "Aquifer thickness must be greater than zero.",
      "invalid_thickness",
    );
  if (!(input.specificStoragePerM >= 0))
    simpleError(
      "specificStoragePerM",
      "Specific storage must be non-negative.",
      "invalid_specific_storage",
    );
  return { storativity: input.aquiferThicknessM * input.specificStoragePerM };
};

export const storativityConfinedExample = {
  input: { aquiferThicknessM: 50, specificStoragePerM: 2e-6 },
  output: { storativity: 9.999999999999999e-5 },
} satisfies ToolExample<StorativityConfinedInput, StorativityConfinedOutput>;

export const storativityConfinedTool = createSimpleTool({
  id: "geology/storativity-confined",
  title: "Storativity Confined Calculator",
  description:
    "Compute confined-aquifer storativity as saturated thickness in meters times specific storage in reciprocal meters.",
  inputs: [
    {
      description: "Saturated aquifer thickness in meters.",
      id: "aquiferThicknessM",
      kind: "number",
      label: "Thickness",
      minimum: 0,
    },
    {
      description: "Specific storage in reciprocal meters.",
      id: "specificStoragePerM",
      kind: "number",
      label: "Ss",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Storativity (dimensionless).",
      id: "storativity",
      kind: "number",
      label: "S",
    },
  ],
  calculate: (input) =>
    calculateStorativityConfined(input as unknown as StorativityConfinedInput),
});

export const runStorativityConfined = storativityConfinedTool.execute;
export default storativityConfinedTool;
