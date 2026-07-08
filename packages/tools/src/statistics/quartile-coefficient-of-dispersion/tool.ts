import { createSimpleTool, simpleError } from "../../core/simple.js";
export const quartileCoefficientOfDispersionTool = createSimpleTool({
  id: "statistics/quartile-coefficient-of-dispersion",
  title: "Quartile Coefficient of Dispersion Calculator",
  description: "Calculate quartile dispersion from first and third quartiles.",
  inputs: [
    { id: "firstQuartile", label: "First quartile", kind: "number" },
    { id: "thirdQuartile", label: "Third quartile", kind: "number" },
  ],
  outputs: [
    {
      id: "coefficient",
      label: "Quartile coefficient of dispersion",
      kind: "number",
    },
  ],
  calculate: (input) => {
    const first = input.firstQuartile as number,
      third = input.thirdQuartile as number;
    if (first > third)
      simpleError(
        "firstQuartile",
        "First quartile must not exceed third quartile.",
      );
    if (first + third === 0)
      simpleError("firstQuartile", "Quartile sum must not be zero.");
    return { coefficient: (third - first) / (third + first) };
  },
});
export const runQuartileCoefficientOfDispersion =
  quartileCoefficientOfDispersionTool.execute;
export default quartileCoefficientOfDispersionTool;
