import { createSimpleTool } from "../../core/simple.js";
export const aspectRatioTool = createSimpleTool({
  id: "proportions/aspect-ratio",
  title: "Aspect Ratio Calculator",
  description: "Calculate a numeric aspect ratio and reduced integer ratio.",
  inputs: [
    { id: "width", label: "Width", kind: "integer", minimum: 1 },
    { id: "height", label: "Height", kind: "integer", minimum: 1 },
  ],
  outputs: [
    { id: "ratio", label: "Aspect ratio", kind: "number" },
    { id: "reducedWidth", label: "Reduced width", kind: "integer" },
    { id: "reducedHeight", label: "Reduced height", kind: "integer" },
    { id: "formatted", label: "Formatted ratio", kind: "string" },
  ],
  calculate: (input) => {
    const width = input.width as number,
      height = input.height as number;
    let a = width,
      b = height;
    while (b !== 0) [a, b] = [b, a % b];
    return {
      ratio: width / height,
      reducedWidth: width / a,
      reducedHeight: height / a,
      formatted: `${width / a}:${height / a}`,
    };
  },
});
export const runAspectRatio = aspectRatioTool.execute;
export default aspectRatioTool;
