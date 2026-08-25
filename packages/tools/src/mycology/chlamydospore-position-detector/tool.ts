import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const chlamydosporePositionDetectorExample = {
  input: { position: "terminal" },
  output: {
    chlamydosporePosition: "terminal",
    positionDescription: "Chlamydospores occur at hyphal tips.",
    present: true,
  },
} satisfies ToolExample<
  { readonly position: string },
  {
    readonly chlamydosporePosition: string;
    readonly positionDescription: string;
    readonly present: boolean;
  }
>;

const POSITION_DESCRIPTIONS: Record<string, string> = {
  absent: "No chlamydospores were observed.",
  both: "Chlamydospores occur both within hyphae and at hyphal tips.",
  intercalary: "Chlamydospores occur within the course of hyphae.",
  terminal: "Chlamydospores occur at hyphal tips.",
};

export const chlamydosporePositionDetectorTool = createSimpleTool({
  id: "mycology/chlamydospore-position-detector",
  title: "Chlamydospore Position",
  description:
    "Record the position of chlamydospores on the hypha and whether they are present.",
  inputs: [
    {
      enum: ["intercalary", "terminal", "both", "absent"],
      id: "position",
      kind: "string",
      label: "Position",
    },
  ],
  outputs: [
    {
      enum: ["intercalary", "terminal", "both", "absent"],
      id: "chlamydosporePosition",
      kind: "string",
      label: "Chlamydospore position",
    },
    { id: "present", kind: "boolean", label: "Present" },
    {
      id: "positionDescription",
      kind: "string",
      label: "Position description",
    },
  ],
  calculate: (input) => ({
    chlamydosporePosition: input.position as string,
    positionDescription: POSITION_DESCRIPTIONS[input.position as string],
    present: input.position !== "absent",
  }),
});
export const runChlamydosporePositionDetector =
  chlamydosporePositionDetectorTool.execute;
export default chlamydosporePositionDetectorTool;
