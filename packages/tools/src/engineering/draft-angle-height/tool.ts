import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DraftAngleHeightInput = Readonly<{
  readonly heightMillimeters: number;
  readonly draftDegrees: number;
}>;
export type DraftAngleHeightOutput = Readonly<{
  readonly clearanceMillimeters: number;
}>;

export const calculateDraftAngleHeight = (
  x: DraftAngleHeightInput,
): DraftAngleHeightOutput => {
  if (!Number.isFinite(x.heightMillimeters) || x.heightMillimeters < 0)
    simpleError("heightMillimeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.draftDegrees) || x.draftDegrees < 0)
    simpleError("draftDegrees", "Provide a finite number at least 0.");
  if (x.draftDegrees >= 90)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const clearanceMillimeters =
    x.heightMillimeters * Math.tan((x.draftDegrees * Math.PI) / 180);
  if (!Number.isFinite(clearanceMillimeters))
    simpleError(
      "clearanceMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    clearanceMillimeters: Object.is(clearanceMillimeters, -0)
      ? 0
      : clearanceMillimeters,
  };
};

export const example = {
  input: { heightMillimeters: 100, draftDegrees: 2 },
  output: { clearanceMillimeters: 3.492076949174773 },
} satisfies ToolExample<DraftAngleHeightInput, DraftAngleHeightOutput>;

export const tool = createSimpleTool({
  id: "engineering/draft-angle-height",
  title: "Draft Angle Height",
  description:
    "Lateral draft clearance h tanθ accumulated over mold or casting wall height.",
  inputs: [
    {
      id: "heightMillimeters",
      kind: "number",
      label: "Height Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "draftDegrees",
      kind: "number",
      label: "Draft Degrees",
      unit: "°",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "clearanceMillimeters",
      kind: "number",
      label: "Clearance Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateDraftAngleHeight({
      heightMillimeters: input.heightMillimeters as number,
      draftDegrees: input.draftDegrees as number,
    }),
});
export const draftAngleHeightTool = tool;
export const runDraftAngleHeight = tool.execute;
export default tool;
