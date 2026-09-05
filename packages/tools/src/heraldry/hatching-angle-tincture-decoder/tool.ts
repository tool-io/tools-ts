import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  hatchingPatterns,
} from "../batch43-shared.js";

export type Input = Readonly<{
  readonly lineAnglesDegrees: readonly number[];
  readonly stippled: boolean;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "lineAnglesDegrees",
    label: "Observed line angles",
    kind: "numberList",
  },
  { id: "stippled", label: "Observed stippling", kind: "boolean" },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  if (
    input.lineAnglesDegrees.length > 4 ||
    input.lineAnglesDegrees.some((v) => v < 0 || v >= 180) ||
    new Set(input.lineAnglesDegrees).size !== input.lineAnglesDegrees.length
  )
    simpleError(
      "angles",
      "At most four distinct observed angles normalized to 0–less-than-180 degrees.",
    );
  const angles = [...input.lineAnglesDegrees].sort((a, b) => a - b);
  return {
    matchingTinctures: Object.entries(hatchingPatterns)
      .filter(
        ([, p]) =>
          p.stippled === input.stippled &&
          p.lineAnglesDegrees.length === angles.length &&
          p.lineAnglesDegrees.every((v, i) => v === angles[i]),
      )
      .map(([name]) => name),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { lineAnglesDegrees: [90], stippled: false },
  output: { result: { matchingTinctures: ["gules"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "heraldry/hatching-angle-tincture-decoder",
  title: "Hatching Line Angle to Tincture Decoder",
  description:
    "Match a complete independently observed line-angle/stippling pattern to seven common Petra Sancta tinctures, sharing the encoder reference. Angles clockwise from viewer x-right in y-down coordinates, modulo 180, exact comparisons; unrecognized valid patterns return no match. No automatic image extraction, historical authenticity or inferred missing stippling.",
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
