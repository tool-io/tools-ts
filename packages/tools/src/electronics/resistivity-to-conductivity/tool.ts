import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ResistivityToConductivityInput = {
  readonly resistivityOhmM: number;
};

export type ResistivityToConductivityOutput = {
  readonly conductivitySPersM: number;
};

export const resistivityToConductivityExample = {
  input: { resistivityOhmM: 1.68e-8 },
  output: { conductivitySPersM: 59523809.523809515 },
} satisfies ToolExample<
  ResistivityToConductivityInput,
  ResistivityToConductivityOutput
>;

export const resistivityToConductivityTool = createSimpleTool({
  calculate: (input) => {
    const { resistivityOhmM } =
      input as unknown as ResistivityToConductivityInput;
    if (resistivityOhmM <= 0)
      simpleError(
        "resistivityOhmM",
        "Resistivity must be positive.",
        "degenerate_input",
      );
    return { conductivitySPersM: 1 / resistivityOhmM };
  },
  description:
    "Compute electrical conductivity in siemens per meter as the reciprocal of resistivity.",
  id: "electronics/resistivity-to-conductivity",
  inputs: [
    {
      id: "resistivityOhmM",
      kind: "number",
      label: "Resistivity",
      unit: "ohm*m",
    },
  ],
  outputs: [
    {
      id: "conductivitySPersM",
      kind: "number",
      label: "Conductivity",
      unit: "S/m",
    },
  ],
  title: "Conductivity From Resistivity",
});
export const runResistivityToConductivity =
  resistivityToConductivityTool.execute;
export default resistivityToConductivityTool;
