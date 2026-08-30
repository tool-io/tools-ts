import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HallEffectSwitchHysteresisInput = Readonly<{
  readonly operateMillitesla: number;
  readonly releaseMillitesla: number;
}>;
export type HallEffectSwitchHysteresisOutput = Readonly<{
  readonly hysteresisMillitesla: number;
}>;

export const calculateHallEffectSwitchHysteresis = (
  x: HallEffectSwitchHysteresisInput,
): HallEffectSwitchHysteresisOutput => {
  if (!Number.isFinite(x.operateMillitesla))
    simpleError("operateMillitesla", "Provide a finite number.");
  if (!Number.isFinite(x.releaseMillitesla))
    simpleError("releaseMillitesla", "Provide a finite number.");
  if (x.operateMillitesla < x.releaseMillitesla)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const hysteresisMillitesla = x.operateMillitesla - x.releaseMillitesla;
  if (!Number.isFinite(hysteresisMillitesla))
    simpleError(
      "hysteresisMillitesla",
      "Inputs produce an undefined or non-finite result.",
    );
  return {
    hysteresisMillitesla: Object.is(hysteresisMillitesla, -0)
      ? 0
      : hysteresisMillitesla,
  };
};

export const example = {
  input: { operateMillitesla: 5, releaseMillitesla: 3 },
  output: { hysteresisMillitesla: 2 },
} satisfies ToolExample<
  HallEffectSwitchHysteresisInput,
  HallEffectSwitchHysteresisOutput
>;

export const tool = createSimpleTool({
  id: "electronics/hall-effect-switch-hysteresis",
  title: "Hall Effect Switch Hysteresis",
  description:
    "Magnetic hysteresis window between the Hall switch operating and release thresholds.",
  inputs: [
    {
      id: "operateMillitesla",
      kind: "number",
      label: "Operate Millitesla",
      unit: "mT",
    },
    {
      id: "releaseMillitesla",
      kind: "number",
      label: "Release Millitesla",
      unit: "mT",
    },
  ],
  outputs: [
    {
      id: "hysteresisMillitesla",
      kind: "number",
      label: "Hysteresis Millitesla",
      unit: "mT",
    },
  ],
  calculate: (input) =>
    calculateHallEffectSwitchHysteresis({
      operateMillitesla: input.operateMillitesla as number,
      releaseMillitesla: input.releaseMillitesla as number,
    }),
});
export const hallEffectSwitchHysteresisTool = tool;
export const runHallEffectSwitchHysteresis = tool.execute;
export default tool;
