import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const nucleusCytoplasmRatioExample = {
  input: { cytoplasmAreaUm2: 200, nucleusAreaUm2: 50 },
} satisfies ToolExample<{
  readonly cytoplasmAreaUm2: number;
  readonly nucleusAreaUm2: number;
}>;

export const nucleusCytoplasmRatioTool = createSimpleTool({
  id: "biology/nucleus-cytoplasm-ratio",
  title: "N:C Ratio",
  description:
    "Compute the nucleus-to-cytoplasm ratio from nuclear and cytoplasmic cross-sectional areas.",
  inputs: [
    {
      id: "nucleusAreaUm2",
      label: "Nucleus area",
      kind: "number",
      unit: "\u00b5m\u00b2",
    },
    {
      id: "cytoplasmAreaUm2",
      label: "Cytoplasm area",
      kind: "number",
      unit: "\u00b5m\u00b2",
    },
  ],
  outputs: [
    { id: "nucleusCytoplasmRatio", label: "N:C ratio", kind: "number" },
  ],
  calculate: (input) => {
    const nucleusAreaUm2 = input.nucleusAreaUm2 as number;
    const cytoplasmAreaUm2 = input.cytoplasmAreaUm2 as number;
    if (nucleusAreaUm2 < 0)
      simpleError(
        "nucleusAreaUm2",
        "Nucleus area must not be negative.",
        "invalid_area",
      );
    if (cytoplasmAreaUm2 <= 0)
      simpleError(
        "cytoplasmAreaUm2",
        "Cytoplasm area must be positive.",
        "invalid_area",
      );
    return { nucleusCytoplasmRatio: nucleusAreaUm2 / cytoplasmAreaUm2 };
  },
});
export const runNucleusCytoplasmRatio = nucleusCytoplasmRatioTool.execute;
export default nucleusCytoplasmRatioTool;
