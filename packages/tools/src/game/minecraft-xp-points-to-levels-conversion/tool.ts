import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  bounded,
  minecraftXp,
} from "../batch52-shared.js";
export type Input = Readonly<{ readonly totalExperiencePoints: number }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "totalExperiencePoints",
    label: "Total experience points",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  bounded(i.totalExperiencePoints, "xp", 0, 1000000000);
  let lo = 0,
    hi = 100000;
  while (lo < hi) {
    const m = Math.ceil((lo + hi) / 2);
    if (minecraftXp(m) <= i.totalExperiencePoints) lo = m;
    else hi = m - 1;
  }
  const start = minecraftXp(lo),
    next = minecraftXp(lo + 1);
  return {
    level: lo,
    pointsIntoLevel: i.totalExperiencePoints - start,
    fractionIntoLevel: (i.totalExperiencePoints - start) / (next - start),
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { totalExperiencePoints: 352 },
  output: { result: { level: 16, pointsIntoLevel: 0, fractionIntoLevel: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/minecraft-xp-points-to-levels-conversion",
  title: "Minecraft XP Points to Levels Conversion",
  description:
    "Invert vanilla Minecraft cumulative XP level formulas over integer points; edition/modded behavior and orb loss excluded.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          level: { type: "number" },
          pointsIntoLevel: { type: "number" },
          fractionIntoLevel: { type: "number" },
        },
        required: ["level", "pointsIntoLevel", "fractionIntoLevel"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
