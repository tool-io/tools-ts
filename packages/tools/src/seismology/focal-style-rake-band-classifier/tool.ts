import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const focalStyleRakeBandClassifierExample = {
  input: { rakeDeg: 170 },
  output: { focalStyle: "strike-slip", slipSense: "lateral motion dominates" },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const focalStyleRakeBandClassifierTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ rakeDeg }) => {
      const r = ((rakeDeg + 540) % 360) - 180;
      let focalStyle;
      if (Math.abs(r) <= 30) focalStyle = "strike-slip";
      else if (r >= 150 || r <= -150) focalStyle = "strike-slip";
      else if (r > 0 && r < 90) focalStyle = "reverse-oblique";
      else if (r >= 90) focalStyle = "reverse";
      else if (r < 0 && r > -90) focalStyle = "normal-oblique";
      else focalStyle = "normal";
      return {
        focalStyle,
        slipSense:
          focalStyle === "strike-slip"
            ? "lateral motion dominates"
            : focalStyle.includes("oblique")
              ? "mixed lateral and dip-slip motion"
              : focalStyle === "reverse"
                ? "hanging wall moves up"
                : "hanging wall moves down",
      };
    })(input as never) as Record<string, unknown>,
  description:
    "Classify focal-mechanism style from the rake angle using standard Aki-Richards bands.",
  id: "seismology/focal-style-rake-band-classifier",
  inputs: [
    {
      description: "Rake of the first nodal plane.",
      id: "rakeDeg",
      kind: "number",
      label: "λ",
      unit: "°",
    },
  ],
  outputs: [
    {
      description: "Strike-slip, normal, reverse, or oblique variant.",
      id: "focalStyle",
      kind: "string",
      label: "Style",
    },
    {
      description: "Dominant slip sense description.",
      id: "slipSense",
      kind: "string",
      label: "Sense",
    },
  ],
  title: "Focal Style Rake Band Classifier",
});
export const runFocalStyleRakeBandClassifier =
  focalStyleRakeBandClassifierTool.execute;
export { focalStyleRakeBandClassifierExample as example };
export default focalStyleRakeBandClassifierTool;
