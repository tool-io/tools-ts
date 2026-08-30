import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CriticalShaftSpeedInput = Readonly<{
  readonly gravityMetersPerSecondSquared: number;
  readonly staticDeflectionMeters: number;
}>;
export type CriticalShaftSpeedOutput = Readonly<{
  readonly criticalRpm: number;
}>;

export const calculateCriticalShaftSpeed = (
  x: CriticalShaftSpeedInput,
): CriticalShaftSpeedOutput => {
  if (
    !Number.isFinite(x.gravityMetersPerSecondSquared) ||
    x.gravityMetersPerSecondSquared < 0
  )
    simpleError(
      "gravityMetersPerSecondSquared",
      "Provide a finite number at least 0.",
    );
  if (
    !Number.isFinite(x.staticDeflectionMeters) ||
    x.staticDeflectionMeters < 0
  )
    simpleError(
      "staticDeflectionMeters",
      "Provide a finite number at least 0.",
    );
  const criticalRpm =
    (30 *
      Math.sqrt(x.gravityMetersPerSecondSquared / x.staticDeflectionMeters)) /
    Math.PI;
  if (!Number.isFinite(criticalRpm))
    simpleError(
      "criticalRpm",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { criticalRpm: Object.is(criticalRpm, -0) ? 0 : criticalRpm };
};

export const example = {
  input: { gravityMetersPerSecondSquared: 9.81, staticDeflectionMeters: 0.001 },
  output: { criticalRpm: 945.8143213010682 },
} satisfies ToolExample<CriticalShaftSpeedInput, CriticalShaftSpeedOutput>;

export const tool = createSimpleTool({
  id: "engineering/critical-shaft-speed",
  title: "Critical Shaft Speed",
  description:
    "Undamped first critical rotational speed estimated from a measured static shaft deflection under gravity: n=30√(g/δ)/π.",
  inputs: [
    {
      id: "gravityMetersPerSecondSquared",
      kind: "number",
      label: "Gravity Meters Per Second Squared",
      unit: "m/s²",
      minimum: 0,
    },
    {
      id: "staticDeflectionMeters",
      kind: "number",
      label: "Static Deflection Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    { id: "criticalRpm", kind: "number", label: "Critical Rpm", unit: "rpm" },
  ],
  calculate: (input) =>
    calculateCriticalShaftSpeed({
      gravityMetersPerSecondSquared:
        input.gravityMetersPerSecondSquared as number,
      staticDeflectionMeters: input.staticDeflectionMeters as number,
    }),
});
export const criticalShaftSpeedTool = tool;
export const runCriticalShaftSpeed = tool.execute;
export default tool;
