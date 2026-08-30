import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly rt2000Seconds: number;
  readonly rt4000Seconds: number;
  readonly rt500Seconds: number;
  readonly rt1000Seconds: number;
}>;
export type Output = Readonly<{ readonly ratio: number }>;

export const calculate = (input: Input): Output => {
  for (const [field, value] of Object.entries(input))
    if (!Number.isFinite(value) || value <= 0)
      simpleError(
        field,
        "Reverberation times must be finite and positive.",
        "invalid_reverberation_time",
      );
  const directRatio =
    (input.rt2000Seconds + input.rt4000Seconds) /
    (input.rt500Seconds + input.rt1000Seconds);
  const scale = Math.max(...Object.values(input));
  const ratio = Number.isFinite(directRatio)
    ? directRatio
    : (input.rt2000Seconds / scale + input.rt4000Seconds / scale) /
      (input.rt500Seconds / scale + input.rt1000Seconds / scale);
  if (!Number.isFinite(ratio) || ratio <= 0)
    simpleError("ratio", "Ratio is out of range.", "numeric_overflow");
  return { ratio };
};

export const example = {
  input: {
    rt2000Seconds: 1.6,
    rt4000Seconds: 1.4,
    rt500Seconds: 1.8,
    rt1000Seconds: 1.7,
  },
  output: { ratio: 0.8571428571428571 },
} satisfies ToolExample<Input, Output>;
export const edgeCase = {
  input: {
    rt2000Seconds: 1,
    rt4000Seconds: 1,
    rt500Seconds: 1,
    rt1000Seconds: 1,
  },
  output: { ratio: 1 },
} satisfies { readonly input: Input; readonly output: Output };

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      rt2000Seconds: input.rt2000Seconds as number,
      rt4000Seconds: input.rt4000Seconds as number,
      rt500Seconds: input.rt500Seconds as number,
      rt1000Seconds: input.rt1000Seconds as number,
    }),
  description:
    "Calculate (T2000 + T4000) / (T500 + T1000) from caller-supplied reverberation times; interpretation remains project-specific.",
  id: "acoustics/brilliance-ratio",
  inputs: [
    {
      id: "rt2000Seconds",
      kind: "number",
      label: "RT 2000",
      minimum: 0,
      unit: "s",
    },
    {
      id: "rt4000Seconds",
      kind: "number",
      label: "RT 4000",
      minimum: 0,
      unit: "s",
    },
    {
      id: "rt500Seconds",
      kind: "number",
      label: "RT 500",
      minimum: 0,
      unit: "s",
    },
    {
      id: "rt1000Seconds",
      kind: "number",
      label: "RT 1000",
      minimum: 0,
      unit: "s",
    },
  ],
  outputs: [{ id: "ratio", kind: "number", label: "Ratio", minimum: 0 }],
  title: "Brilliance Ratio",
});

export const run = tool.execute;
export default tool;
