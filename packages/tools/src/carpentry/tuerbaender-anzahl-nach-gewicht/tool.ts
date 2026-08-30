import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type TuerbaenderAnzahlNachGewichtInput = Readonly<{
  readonly doorKilograms: number;
  readonly ratedKilogramsPerHinge: number;
}>;
export type TuerbaenderAnzahlNachGewichtOutput = Readonly<{
  readonly hingeCount: number;
}>;

export const calculateTuerbaenderAnzahlNachGewicht = (
  x: TuerbaenderAnzahlNachGewichtInput,
): TuerbaenderAnzahlNachGewichtOutput => {
  if (!Number.isFinite(x.doorKilograms) || x.doorKilograms < 0)
    simpleError("doorKilograms", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.ratedKilogramsPerHinge) ||
    x.ratedKilogramsPerHinge < 0
  )
    simpleError(
      "ratedKilogramsPerHinge",
      "Provide a finite number at least 0.",
    );
  const hingeCount = Math.ceil(x.doorKilograms / x.ratedKilogramsPerHinge);
  if (!Number.isFinite(hingeCount) || !Number.isSafeInteger(hingeCount))
    simpleError(
      "hingeCount",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { hingeCount: Object.is(hingeCount, -0) ? 0 : hingeCount };
};

export const example = {
  input: { doorKilograms: 40, ratedKilogramsPerHinge: 15 },
  output: { hingeCount: 3 },
} satisfies ToolExample<
  TuerbaenderAnzahlNachGewichtInput,
  TuerbaenderAnzahlNachGewichtOutput
>;

export const tool = createSimpleTool({
  id: "carpentry/tuerbaender-anzahl-nach-gewicht",
  title: "Tuerbaender Anzahl Nach Gewicht",
  description:
    "Mass-only arithmetic lower bound from door mass and a per-hinge rating for the same installation. It is not a safe hinge specification: door width, hinge spacing, and load distribution must be checked separately.",
  inputs: [
    {
      id: "doorKilograms",
      kind: "number",
      label: "Door Kilograms",
      unit: "kg",
      minimum: 0,
    },
    {
      id: "ratedKilogramsPerHinge",
      kind: "number",
      label: "Rated Kilograms Per Hinge",
      unit: "kg",
      minimum: 0,
    },
  ],
  outputs: [{ id: "hingeCount", kind: "integer", label: "Hinge Count" }],
  calculate: (input) =>
    calculateTuerbaenderAnzahlNachGewicht({
      doorKilograms: input.doorKilograms as number,
      ratedKilogramsPerHinge: input.ratedKilogramsPerHinge as number,
    }),
});
export const tuerbaenderAnzahlNachGewichtTool = tool;
export const runTuerbaenderAnzahlNachGewicht = tool.execute;
export default tool;
