import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type SailForceInput = {
  readonly dragCoefficient?: number;
  readonly sailAreaM2: number;
  readonly windSpeedMs: number;
};

export type SailForceOutput = {
  readonly sailForceNewtons: number;
};

const AIR_DENSITY_KG_PER_M3 = 1.225;
const DEFAULT_DRAG_COEFFICIENT = 1.1;

export const sailForceExample = {
  input: { sailAreaM2: 50, windSpeedMs: 10 },
  output: { sailForceNewtons: 3368.7500000000005 },
} satisfies ToolExample<SailForceInput, SailForceOutput>;

export const calculateSailForce = (input: SailForceInput): SailForceOutput => {
  if (input.windSpeedMs <= 0)
    simpleError("windSpeedMs", "Wind speed must be positive.", "invalid_input");
  if (input.sailAreaM2 <= 0)
    simpleError("sailAreaM2", "Sail area must be positive.", "invalid_input");
  return {
    sailForceNewtons:
      0.5 *
      AIR_DENSITY_KG_PER_M3 *
      input.windSpeedMs *
      input.windSpeedMs *
      input.sailAreaM2 *
      (input.dragCoefficient ?? DEFAULT_DRAG_COEFFICIENT),
  };
};

export const sailForceTool = createSimpleTool({
  calculate: (input) =>
    calculateSailForce({
      dragCoefficient: input.dragCoefficient as number | undefined,
      sailAreaM2: input.sailAreaM2 as number,
      windSpeedMs: input.windSpeedMs as number,
    }),
  description:
    "Compute aerodynamic sail force from forceNewtons = 0.5 * 1.225 * windSpeedMs^2 * sailAreaM2 * dragCoefficient.",
  id: "sailing/sail-force",
  inputs: [
    {
      description: "True wind speed.",
      id: "windSpeedMs",
      kind: "number",
      label: "Wind speed",
      minimum: 0,
      unit: "m/s",
    },
    {
      description: "Total sail area.",
      id: "sailAreaM2",
      kind: "number",
      label: "Sail area",
      minimum: 0,
      unit: "m\u00B2",
    },
    {
      default: DEFAULT_DRAG_COEFFICIENT,
      description: "Drag coefficient between 0.1 and 2.",
      id: "dragCoefficient",
      kind: "number",
      label: "Drag coefficient",
      maximum: 2,
      minimum: 0.1,
    },
  ],
  outputs: [
    {
      description: "Aerodynamic force on the sail.",
      format: "force",
      id: "sailForceNewtons",
      kind: "number",
      label: "Sail force",
      unit: "N",
    },
  ],
  title: "Sail Drag Force Calculator",
});
export const runSailForce = sailForceTool.execute;
export default sailForceTool;
