import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const od600ToCfuExample = {
  input: { od600: 0.5 },
  output: { estimatedCfuPerMl: 500000000 },
} satisfies ToolExample<
  { readonly conversionFactor?: number; readonly od600: number },
  { readonly estimatedCfuPerMl: number }
>;

export const od600ToCfuTool = createSimpleTool({
  id: "biology/od600-to-cfu",
  title: "OD600 To CFU",
  description:
    "Convert an OD600 absorbance reading to an estimated bacterial density: CFU/mL = OD600 x conversionFactor, using a species-dependent factor that defaults to 1e9 CFU per OD600 unit.",
  inputs: [
    {
      description: "Optical density at 600 nm; must not be negative.",
      id: "od600",
      label: "OD600",
      kind: "number",
      minimum: 0,
    },
    {
      default: 1000000000,
      description: "Calibration factor in CFU per OD600 unit; defaults to 1e9.",
      id: "conversionFactor",
      label: "Conversion factor",
      kind: "number",
    },
  ],
  outputs: [
    {
      description: "Estimated viable cell density in CFU per mL.",
      id: "estimatedCfuPerMl",
      label: "Estimated CFU/mL",
      kind: "number",
      unit: "CFU/mL",
    },
  ],
  calculate: (input) => {
    const od600 = input.od600 as number;
    const conversionFactor = input.conversionFactor as number;
    if (!(conversionFactor > 0))
      simpleError(
        "conversionFactor",
        "The conversion factor must be greater than zero.",
      );
    return { estimatedCfuPerMl: od600 * conversionFactor };
  },
});
export const runOd600ToCfu = od600ToCfuTool.execute;
export default od600ToCfuTool;
