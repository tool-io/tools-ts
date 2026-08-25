import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export type PhialideCollaretteDetectorInput = {
  readonly collarette: "absent" | "present-cylindrical" | "present-flared";
};

export type PhialideCollaretteDetectorOutput = {
  readonly collaretteState: PhialideCollaretteDetectorInput["collarette"];
  readonly visible: boolean;
};

export const phialideCollaretteDetectorExample = {
  input: { collarette: "present-flared" },
  output: { collaretteState: "present-flared", visible: true },
} satisfies ToolExample<
  PhialideCollaretteDetectorInput,
  PhialideCollaretteDetectorOutput
>;

export const phialideCollaretteDetectorTool = createSimpleTool({
  id: "mycology/phialide-collarette-detector",
  title: "Collarette Detector",
  description:
    "Detect whether a phialide collarette is visible and report its recorded state.",
  inputs: [
    {
      enum: ["present-flared", "present-cylindrical", "absent"],
      id: "collarette",
      kind: "string",
      label: "Collarette state",
    },
  ],
  outputs: [
    { id: "collaretteState", label: "Collarette state", kind: "string" },
    { id: "visible", label: "Visible", kind: "boolean" },
  ],
  calculate: (input) => ({
    collaretteState:
      input.collarette as PhialideCollaretteDetectorInput["collarette"],
    visible: input.collarette !== "absent",
  }),
});
export const runPhialideCollaretteDetector =
  phialideCollaretteDetectorTool.execute;
export default phialideCollaretteDetectorTool;
