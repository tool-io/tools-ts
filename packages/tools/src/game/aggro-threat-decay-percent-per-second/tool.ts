import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  nonnegative,
  fraction,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly initialThreat: number;
  readonly decayFractionPerSecond: number;
  readonly elapsedSeconds: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "initialThreat", label: "Initial threat", kind: "number" },
  {
    id: "decayFractionPerSecond",
    label: "Decay fraction per second",
    kind: "number",
  },
  { id: "elapsedSeconds", label: "Elapsed seconds", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  nonnegative(i.initialThreat, "threat");
  fraction(i.decayFractionPerSecond, "decay");
  nonnegative(i.elapsedSeconds, "time");
  return {
    remainingThreat:
      i.decayFractionPerSecond === 1
        ? i.elapsedSeconds === 0
          ? i.initialThreat
          : 0
        : i.initialThreat *
          Math.exp(i.elapsedSeconds * Math.log1p(-i.decayFractionPerSecond)),
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { initialThreat: 100, decayFractionPerSecond: 0.5, elapsedSeconds: 2 },
  output: { result: { remainingThreat: 25 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/aggro-threat-decay-percent-per-second",
  title: "Aggro Threat Decay % Per Second",
  description:
    "Conditional multiplicative threat decay per second, fractional elapsed time continuous extension; no game-specific aggro solver.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { remainingThreat: { type: "number" } },
        required: ["remainingThreat"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
