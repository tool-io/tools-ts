import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HullResistanceFrictionalInput = {
  readonly frictionCoefficient?: number;
  readonly speedMs: number;
  readonly wettedAreaM2: number;
};

export type HullResistanceFrictionalOutput = {
  readonly frictionalResistanceNewtons: number;
};

const SEAWATER_DENSITY_KG_PER_M3 = 1025;
const DEFAULT_FRICTION_COEFFICIENT = 0.004;

export const hullResistanceFrictionalExample = {
  input: { speedMs: 2, wettedAreaM2: 20 },
  output: { frictionalResistanceNewtons: 164 },
} satisfies ToolExample<
  HullResistanceFrictionalInput,
  HullResistanceFrictionalOutput
>;

export const hullResistanceFrictionalTool = createSimpleTool({
  calculate: (input) => {
    const speedMs = input.speedMs as number;
    const wettedAreaM2 = input.wettedAreaM2 as number;
    if (speedMs < 0)
      simpleError("speedMs", "Speed cannot be negative.", "invalid_speed");
    if (wettedAreaM2 < 0)
      simpleError(
        "wettedAreaM2",
        "Wetted area cannot be negative.",
        "invalid_area",
      );
    return {
      frictionalResistanceNewtons:
        0.5 *
        SEAWATER_DENSITY_KG_PER_M3 *
        speedMs *
        speedMs *
        wettedAreaM2 *
        (input.frictionCoefficient as number),
    };
  },
  description:
    "Compute frictional hull resistance using frictionalResistanceNewtons = 0.5 * 1025 * speedMs^2 * wettedAreaM2 * frictionCoefficient with a default coefficient of 0.004.",
  id: "sailing/hull-resistance-frictional",
  inputs: [
    {
      default: DEFAULT_FRICTION_COEFFICIENT,
      description: "Friction (skin drag) coefficient between 0.001 and 0.01.",
      id: "frictionCoefficient",
      kind: "number",
      label: "Friction coefficient",
      maximum: 0.01,
      minimum: 0.001,
    },
    {
      description: "Boat speed through the water.",
      id: "speedMs",
      kind: "number",
      label: "Speed",
      minimum: 0,
      unit: "m/s",
    },
    {
      description: "Wetted surface area of the hull.",
      id: "wettedAreaM2",
      kind: "number",
      label: "Wetted area",
      minimum: 0,
      unit: "m\u00B2",
    },
  ],
  outputs: [
    {
      description: "Frictional resistance opposing forward motion.",
      format: "force",
      id: "frictionalResistanceNewtons",
      kind: "number",
      label: "Frictional resistance",
      unit: "N",
    },
  ],
  title: "Frictional Resistance",
});
export const runHullResistanceFrictional = hullResistanceFrictionalTool.execute;
export default hullResistanceFrictionalTool;
