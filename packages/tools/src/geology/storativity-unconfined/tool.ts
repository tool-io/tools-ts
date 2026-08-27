import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type StorativityUnconfinedInput = {
  readonly specificYield: number;
  readonly saturatedThicknessM: number;
  readonly specificStoragePerM: number;
};

export type StorativityUnconfinedOutput = {
  readonly storativity: number;
};

export const calculateStorativityUnconfined = (
  input: StorativityUnconfinedInput,
): StorativityUnconfinedOutput => {
  if (!(input.specificYield >= 0 && input.specificYield <= 1))
    simpleError(
      "specificYield",
      "Specific yield must lie between zero and one.",
      "invalid_specific_yield",
    );
  if (!(input.saturatedThicknessM > 0))
    simpleError(
      "saturatedThicknessM",
      "Saturated thickness must be greater than zero.",
      "invalid_thickness",
    );
  if (!(input.specificStoragePerM >= 0))
    simpleError(
      "specificStoragePerM",
      "Specific storage must be non-negative.",
      "invalid_specific_storage",
    );
  return {
    storativity:
      input.specificYield +
      input.saturatedThicknessM * input.specificStoragePerM,
  };
};

export const storativityUnconfinedExample = {
  input: {
    specificYield: 0.25,
    saturatedThicknessM: 40,
    specificStoragePerM: 1e-6,
  },
  output: { storativity: 0.25004 },
} satisfies ToolExample<
  StorativityUnconfinedInput,
  StorativityUnconfinedOutput
>;

export const storativityUnconfinedTool = createSimpleTool({
  id: "geology/storativity-unconfined",
  title: "Storativity Unconfined Calculator",
  description:
    "Compute unconfined-aquifer storativity as specific yield plus the elastic storage term of saturated thickness times specific storage.",
  inputs: [
    {
      description: "Specific yield (dimensionless).",
      id: "specificYield",
      kind: "number",
      label: "Sy",
    },
    {
      description: "Saturated thickness in meters.",
      id: "saturatedThicknessM",
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
    calculateStorativityUnconfined(
      input as unknown as StorativityUnconfinedInput,
    ),
});

export const runStorativityUnconfined = storativityUnconfinedTool.execute;
export default storativityUnconfinedTool;
