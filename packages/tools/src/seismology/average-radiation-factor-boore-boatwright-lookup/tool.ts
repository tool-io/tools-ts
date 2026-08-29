import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const averageRadiationFactorBooreBoatwrightLookupExample = {
  input: { phaseKind: "S" },
  output: {
    averageFactor: 0.55,
    partitionNote: "split across two horizontal components by √2",
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const averageRadiationFactorBooreBoatwrightLookupTool = createSimpleTool(
  {
    calculate: (input: Readonly<Record<string, unknown>>) =>
      (({ phaseKind }) => {
        const key = String(phaseKind).toUpperCase();
        if (key === "P")
          return {
            averageFactor: 0.51,
            partitionNote: "single component; no partition factor applied",
          };
        if (key === "S")
          return {
            averageFactor: 0.55,
            partitionNote: "split across two horizontal components by √2",
          };
        simpleError("phaseKind", "Use P or S.");
      })(input as never) as Record<string, unknown>,
    description:
      "Boore-Boatwright style average radiation factors for P and S waves over the focal sphere.",
    id: "seismology/average-radiation-factor-boore-boatwright-lookup",
    inputs: [
      {
        description: "P or S.",
        id: "phaseKind",
        kind: "string",
        label: "Phase",
      },
    ],
    outputs: [
      {
        description: "Average radiation factor.",
        id: "averageFactor",
        kind: "number",
        label: "⟨F⟩",
      },
      {
        description: "Component partition note.",
        id: "partitionNote",
        kind: "string",
        label: "Partition",
      },
    ],
    title: "Average Radiation Factor Boore Boatwright Lookup",
  },
);
export const runAverageRadiationFactorBooreBoatwrightLookup =
  averageRadiationFactorBooreBoatwrightLookupTool.execute;
export { averageRadiationFactorBooreBoatwrightLookupExample as example };
export default averageRadiationFactorBooreBoatwrightLookupTool;
