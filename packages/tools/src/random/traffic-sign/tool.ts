// Repertoire source: an explicitly scoped tool.io repertoire
import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";
import type { RandomSource } from "../number/tool.js";
import { selectRandomValue } from "../random-value.js";

export type RandomTrafficSignInput = Readonly<Record<string, never>>;
export type RandomTrafficSignOutput = { readonly value: string };

const source = {
  values: [
    "stop",
    "yield",
    "no-entry",
    "speed-limit",
    "pedestrian-crossing",
    "roadworks",
    "roundabout",
    "one-way",
  ],
} as const;

export const randomTrafficSignValueCount = 8;

export const calculateRandomTrafficSign = (
  random: RandomSource = Math.random,
): RandomTrafficSignOutput | null => {
  const value = selectRandomValue(source, random);
  return value === null ? null : { value };
};

export const randomTrafficSignExample = {
  input: {},
} satisfies ToolExample<RandomTrafficSignInput, RandomTrafficSignOutput>;

export const randomTrafficSignTool = createSimpleTool({
  calculate: (_input, context) => {
    const output = calculateRandomTrafficSign(context.random ?? Math.random);
    if (output === null)
      return simpleError(
        "",
        "The random source must return a finite value from 0 up to, but not including, 1.",
        "invalid_random_source",
      );
    return output;
  },
  description:
    "Choose one jurisdiction-neutral traffic-sign concept using injected randomness; the portable result is a semantic identifier rather than jurisdiction-specific artwork.",
  id: "random/traffic-sign",
  inputs: [],
  outputs: [
    {
      format: "random/traffic-sign",
      id: "value",
      kind: "string",
      label: "Random Traffic Sign",
    },
  ],
  title: "Random Traffic Sign Generator",
});

export const runRandomTrafficSign = randomTrafficSignTool.execute;
export default randomTrafficSignTool;
