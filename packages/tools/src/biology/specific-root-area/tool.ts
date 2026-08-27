import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SpecificRootAreaInput = {
  readonly rootDryMassG: number;
  readonly rootSurfaceAreaCm2: number;
};

export type SpecificRootAreaOutput = {
  readonly specificRootArea: number;
};

export const specificRootAreaExample = {
  input: { rootDryMassG: 0.6, rootSurfaceAreaCm2: 30 },
  output: { specificRootArea: 50 },
} satisfies ToolExample<SpecificRootAreaInput, SpecificRootAreaOutput>;

export const specificRootAreaTool = createSimpleTool({
  id: "biology/specific-root-area",
  title: "Specific Root Area",
  description:
    "Compute specific root area SRA in square centimetres per gram as root surface area divided by root dry mass.",
  inputs: [
    {
      id: "rootSurfaceAreaCm2",
      kind: "number",
      label: "Root surface area",
      unit: "cm²",
    },
    {
      id: "rootDryMassG",
      kind: "number",
      label: "Root dry mass",
      unit: "g",
    },
  ],
  outputs: [
    {
      id: "specificRootArea",
      kind: "number",
      label: "Specific root area",
      unit: "cm²/g",
    },
  ],
  calculate: (input) => {
    const rootSurfaceAreaCm2 = input.rootSurfaceAreaCm2 as number;
    const rootDryMassG = input.rootDryMassG as number;
    if (!(rootSurfaceAreaCm2 > 0))
      simpleError(
        "rootSurfaceAreaCm2",
        "The root surface area must be greater than zero.",
      );
    if (!(rootDryMassG > 0))
      simpleError(
        "rootDryMassG",
        "The root dry mass must be greater than zero.",
      );
    return { specificRootArea: rootSurfaceAreaCm2 / rootDryMassG };
  },
});
export const runSpecificRootArea = specificRootAreaTool.execute;
export default specificRootAreaTool;
