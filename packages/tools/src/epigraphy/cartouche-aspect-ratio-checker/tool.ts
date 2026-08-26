import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CartoucheAspectRatioCheckerInput = {
  readonly widthCm: number;
  readonly heightCm: number;
};

export type CartoucheAspectRatioCheckerOutput = {
  readonly aspectRatio: number;
  readonly orientation: "horizontal" | "square" | "vertical";
};

export const calculateCartoucheAspectRatioChecker = (
  input: CartoucheAspectRatioCheckerInput,
): CartoucheAspectRatioCheckerOutput => {
  for (const key of ["widthCm", "heightCm"] as const) {
    if (!((input[key] as number) > 0))
      return simpleError(
        key,
        "Enclosure dimensions must be greater than zero.",
        "invalid_dimension",
      );
  }
  const aspectRatio = input.heightCm / input.widthCm;
  return {
    aspectRatio,
    orientation:
      aspectRatio > 1 ? "vertical" : aspectRatio < 1 ? "horizontal" : "square",
  };
};

export const cartoucheAspectRatioCheckerExample = {
  input: { widthCm: 6, heightCm: 15 },
  output: { aspectRatio: 2.5, orientation: "vertical" },
} satisfies ToolExample<
  CartoucheAspectRatioCheckerInput,
  CartoucheAspectRatioCheckerOutput
>;

export const cartoucheAspectRatioCheckerTool = createSimpleTool({
  id: "epigraphy/cartouche-aspect-ratio-checker",
  title: "Cartouche Enclosure Oval Aspect Ratio Checker",
  description:
    "Check the height-to-width aspect ratio of a cartouche or oval enclosure and report its orientation.",
  inputs: [
    {
      description: "Enclosure width in centimetres.",
      id: "widthCm",
      kind: "number",
      label: "Width",
      minimum: 0,
    },
    {
      description: "Enclosure height in centimetres.",
      id: "heightCm",
      kind: "number",
      label: "Height",
      minimum: 0,
    },
  ],
  outputs: [
    {
      description: "Height divided by width.",
      id: "aspectRatio",
      kind: "number",
      label: "Aspect ratio",
    },
    {
      description: "Orientation implied by the ratio.",
      id: "orientation",
      enum: ["horizontal", "square", "vertical"],
      kind: "string",
      label: "Orientation",
    },
  ],
  calculate: (input) =>
    calculateCartoucheAspectRatioChecker(
      input as unknown as CartoucheAspectRatioCheckerInput,
    ),
});

export const runCartoucheAspectRatioChecker =
  cartoucheAspectRatioCheckerTool.execute;
export default cartoucheAspectRatioCheckerTool;
