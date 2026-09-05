import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  pick,
  hatchingPatterns,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly tincture: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "tincture", label: "Standard tincture", kind: "string" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const pattern = pick(input.tincture, hatchingPatterns, "tincture");
  return {
    lineAnglesDegrees: [...pattern.lineAnglesDegrees],
    stippled: pattern.stippled,
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { tincture: "gules" },
  output: { result: { lineAnglesDegrees: [90], stippled: false } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/hatching-line-tincture-encoder",
  title: "Hatching System Line-Angle Tincture Encoder",
  description:
    "Encode seven standard tinctures in common Petra Sancta hatching (Fox-Davies, A Complete Guide to Heraldry). Angles clockwise from viewer x-right in y-down coordinates, modulo 180; blank argent, dotted or, crossed sable. No furs/proper, jurisdictional authenticity, line spacing or universal historical hatching claim.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated observation or reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
