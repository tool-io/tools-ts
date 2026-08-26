import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DominoTenonLength =
  "20" | "30" | "40" | "50" | "80" | "100" | "140";

export type DominoRoutingDepthInput = {
  readonly tenonLengthMm: DominoTenonLength;
};

export type DominoRoutingDepthOutput = {
  readonly routingDepthMm: number;
};

const TENON_LENGTH_MM: Record<DominoTenonLength, number> = {
  "20": 20,
  "30": 30,
  "40": 40,
  "50": 50,
  "80": 80,
  "100": 100,
  "140": 140,
};

export const dominoRoutingDepthExample = {
  input: { tenonLengthMm: "50" },
  output: { routingDepthMm: 25 },
} satisfies ToolExample<DominoRoutingDepthInput, DominoRoutingDepthOutput>;

export const dominoRoutingDepthTool = createSimpleTool({
  id: "carpentry/domino-fraestiefe-lookup",
  title: "Domino Routing Depth Calculator",
  description:
    "Compute the mortise depth for a centered Domino loose-tenon joint. Each workpiece normally receives half the nominal tenon length; verify the joiner's available depth-stop setting, especially for the 4 x 20 mm Domino.",
  inputs: [
    {
      description: "Domino tenon length in millimeters.",
      enum: ["20", "30", "40", "50", "80", "100", "140"],
      id: "tenonLengthMm",
      kind: "string",
      label: "Tenon length",
    },
  ],
  outputs: [
    {
      description: "Required routing depth in millimeters.",
      id: "routingDepthMm",
      kind: "number",
      label: "Routing depth",
      unit: "mm",
    },
  ],
  calculate: (input) => {
    const tenonLengthMm = input.tenonLengthMm as DominoTenonLength;
    if (!(tenonLengthMm in TENON_LENGTH_MM))
      simpleError(
        "tenonLengthMm",
        "Unknown Domino tenon length.",
        "unknown_length",
      );
    return { routingDepthMm: TENON_LENGTH_MM[tenonLengthMm] / 2 };
  },
});
export const runDominoRoutingDepth = dominoRoutingDepthTool.execute;
export default dominoRoutingDepthTool;
