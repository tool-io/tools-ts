import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CasebackTurnsCloseInput = Readonly<{
  readonly axialTravelMillimeters: number;
  readonly threadPitchMillimetersPerTurn: number;
}>;
export type CasebackTurnsCloseOutput = Readonly<{
  readonly turns: number;
}>;

export const calculateCasebackTurnsClose = (
  x: CasebackTurnsCloseInput,
): CasebackTurnsCloseOutput => {
  if (
    !Number.isFinite(x.axialTravelMillimeters) ||
    x.axialTravelMillimeters < 0
  )
    simpleError(
      "axialTravelMillimeters",
      "Provide a finite nonnegative number.",
    );
  if (
    !Number.isFinite(x.threadPitchMillimetersPerTurn) ||
    x.threadPitchMillimetersPerTurn <= 0
  )
    simpleError(
      "threadPitchMillimetersPerTurn",
      "Provide a finite positive number.",
    );
  const turns = x.axialTravelMillimeters / x.threadPitchMillimetersPerTurn;
  if (!Number.isFinite(turns))
    simpleError("turns", "Inputs produce an undefined or out-of-range result.");
  return { turns: Object.is(turns, -0) ? 0 : turns };
};

export const example = {
  input: {
    axialTravelMillimeters: 1,
    threadPitchMillimetersPerTurn: 0.5,
  },
  output: { turns: 2 },
} satisfies ToolExample<CasebackTurnsCloseInput, CasebackTurnsCloseOutput>;

export const tool = createSimpleTool({
  id: "horology/caseback-turns-close",
  title: "Caseback Turns Close",
  description:
    "Caseback turns required for a threaded axial travel distance at specified thread pitch.",
  inputs: [
    {
      id: "axialTravelMillimeters",
      kind: "number",
      label: "Axial Travel Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "threadPitchMillimetersPerTurn",
      kind: "number",
      label: "Thread Pitch Millimeters Per Turn",
      unit: "mm/turn",
      minimum: 0,
    },
  ],
  outputs: [{ id: "turns", kind: "number", label: "Turns", unit: "turn" }],
  calculate: (input) =>
    calculateCasebackTurnsClose({
      axialTravelMillimeters: input.axialTravelMillimeters as number,
      threadPitchMillimetersPerTurn:
        input.threadPitchMillimetersPerTurn as number,
    }),
});
export const casebackTurnsCloseTool = tool;
export const runCasebackTurnsClose = tool.execute;
export default tool;
