import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const example = {
  input: { runwayHeadingDeg: 90, windFromDeg: 135, windSpeedKt: 20 },
  output: { headwindKt: 14.142135623730951, crosswindKt: 14.14213562373095 },
} satisfies ToolExample<Record<string, number>, Record<string, number>>;
export const tool = createSimpleTool({
  id: "aviation/quartering-wind-component",
  title: "Quartering Wind Component",
  description:
    "Resolve reported wind-from direction and speed against a runway heading. Positive headwind means wind from ahead; a negative value is a tailwind. Signed crosswind is relative to the heading and should be interpreted with local runway convention.",
  inputs: [
    {
      id: "runwayHeadingDeg",
      kind: "number",
      label: "Runway heading (deg)",
      minimum: 0,
    },
    {
      id: "windFromDeg",
      kind: "number",
      label: "Wind-from direction (deg)",
      minimum: 0,
    },
    { id: "windSpeedKt", kind: "number", label: "Wind speed (kt)", minimum: 0 },
  ],
  outputs: [
    { id: "headwindKt", kind: "number", label: "Headwind Kt" },
    { id: "crosswindKt", kind: "number", label: "Crosswind Kt" },
  ],
  calculate: (input) => {
    const i = input as Record<string, number>;

    const output = {
      headwindKt:
        i.windSpeedKt *
        Math.cos(((i.windFromDeg - i.runwayHeadingDeg) * Math.PI) / 180),
      crosswindKt:
        i.windSpeedKt *
        Math.sin(((i.windFromDeg - i.runwayHeadingDeg) * Math.PI) / 180),
    };
    for (const [field, value] of Object.entries(output))
      if (!Number.isFinite(value))
        simpleError(field, "The inputs produce a non-finite result.");
    return output;
  },
});
export type QuarteringWindComponentInput = Readonly<typeof example.input>;
export type QuarteringWindComponentOutput = Readonly<typeof example.output>;
export const quarteringWindComponentTool = tool;
export const runQuarteringWindComponent = tool.execute;
export default tool;
