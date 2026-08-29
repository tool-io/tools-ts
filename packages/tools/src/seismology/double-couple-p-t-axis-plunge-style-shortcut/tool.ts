import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const doubleCouplePTAxisPlungeStyleShortcutExample = {
  input: { focalStyle: "normal" },
  output: {
    pAxisPlungeDeg: 90,
    tAxisPlungeDeg: 0,
    note: "P vertical; T horizontal across the graben.",
  },
} satisfies ToolExample<Record<string, unknown>, Record<string, unknown>>;

export const doubleCouplePTAxisPlungeStyleShortcutTool = createSimpleTool({
  calculate: (input: Readonly<Record<string, unknown>>) =>
    (({ focalStyle }) => {
      if (focalStyle === "strike-slip")
        return {
          pAxisPlungeDeg: 0,
          tAxisPlungeDeg: 0,
          note: "Both axes horizontal; P at strike+45, T at strike−45.",
        };
      if (focalStyle === "normal")
        return {
          pAxisPlungeDeg: 90,
          tAxisPlungeDeg: 0,
          note: "P vertical; T horizontal across the graben.",
        };
      if (focalStyle === "reverse")
        return {
          pAxisPlungeDeg: 0,
          tAxisPlungeDeg: 90,
          note: "T vertical; P horizontal pushing up-dip.",
        };
      simpleError("focalStyle", "Use strike-slip, normal, or reverse.");
    })(input as never) as Record<string, unknown>,
  description:
    "Shortcut P/T axis plunges for ideal focal styles (strike-slip, normal, reverse).",
  id: "seismology/double-couple-p-t-axis-plunge-style-shortcut",
  inputs: [
    {
      description: "strike-slip, normal, or reverse.",
      id: "focalStyle",
      kind: "string",
      label: "style",
    },
  ],
  outputs: [
    {
      description: "P-axis plunge for the ideal style.",
      id: "pAxisPlungeDeg",
      kind: "number",
      label: "P plunge",
      unit: "°",
    },
    {
      description: "T-axis plunge.",
      id: "tAxisPlungeDeg",
      kind: "number",
      label: "T plunge",
      unit: "°",
    },
    {
      description: "Geometry note.",
      id: "note",
      kind: "string",
      label: "Note",
    },
  ],
  title: "Double Couple P T Axis Plunge Style Shortcut",
});
export const runDoubleCouplePTAxisPlungeStyleShortcut =
  doubleCouplePTAxisPlungeStyleShortcutTool.execute;
export { doubleCouplePTAxisPlungeStyleShortcutExample as example };
export default doubleCouplePTAxisPlungeStyleShortcutTool;
