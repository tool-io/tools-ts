import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type EscapeVelocityInput = Readonly<{
  readonly gravitationalParameterCubicMetersPerSecondSquared: number;
  readonly radiusMeters: number;
}>;
export type EscapeVelocityOutput = Readonly<{
  readonly escapeMetersPerSecond: number;
}>;

export const calculateEscapeVelocity = (
  x: EscapeVelocityInput,
): EscapeVelocityOutput => {
  if (
    !Number.isFinite(x.gravitationalParameterCubicMetersPerSecondSquared) ||
    x.gravitationalParameterCubicMetersPerSecondSquared < 0
  )
    simpleError(
      "gravitationalParameterCubicMetersPerSecondSquared",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.radiusMeters) || x.radiusMeters < 0)
    simpleError("radiusMeters", "Provide a finite number at least 0.");
  const escapeMetersPerSecond = Math.sqrt(
    (2 * x.gravitationalParameterCubicMetersPerSecondSquared) / x.radiusMeters,
  );
  if (!Number.isFinite(escapeMetersPerSecond))
    simpleError(
      "escapeMetersPerSecond",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    escapeMetersPerSecond: Object.is(escapeMetersPerSecond, -0)
      ? 0
      : escapeMetersPerSecond,
  };
};

export const example = {
  input: {
    gravitationalParameterCubicMetersPerSecondSquared: 398600441800000,
    radiusMeters: 6371000,
  },
  output: { escapeMetersPerSecond: 11186.135691389076 },
} satisfies ToolExample<EscapeVelocityInput, EscapeVelocityOutput>;

export const tool = createSimpleTool({
  id: "engineering/escape-velocity",
  title: "Escape Velocity",
  description:
    "Ideal two-body escape speed √(2μ/r) at a specified center-to-center radius; ignores atmosphere and rotation.",
  inputs: [
    {
      id: "gravitationalParameterCubicMetersPerSecondSquared",
      kind: "number",
      label: "Gravitational Parameter Cubic Meters Per Second Squared",
      unit: "m³/s²",
      minimum: 0,
    },
    {
      id: "radiusMeters",
      kind: "number",
      label: "Radius Meters",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "escapeMetersPerSecond",
      kind: "number",
      label: "Escape Meters Per Second",
      unit: "m/s",
    },
  ],
  calculate: (input) =>
    calculateEscapeVelocity({
      gravitationalParameterCubicMetersPerSecondSquared:
        input.gravitationalParameterCubicMetersPerSecondSquared as number,
      radiusMeters: input.radiusMeters as number,
    }),
});
export const escapeVelocityTool = tool;
export const runEscapeVelocity = tool.execute;
export default tool;
