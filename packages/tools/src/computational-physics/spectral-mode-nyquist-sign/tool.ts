import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  index: number;
  sampleCount: number;
  nyquistPolicy: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "index", label: "Index", kind: "integer" },
  { id: "sampleCount", label: "Sample count", kind: "integer" },
  {
    id: "nyquistPolicy",
    label: "Nyquist policy",
    kind: "string",
    enum: ["positive", "negative"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.sampleCount, 1, 1000000);
  H.int(i.index, 0, i.sampleCount - 1);
  H.choice(i.nyquistPolicy, ["positive", "negative"]);
  return H.finish({
    signedMode:
      i.index < i.sampleCount / 2
        ? i.index
        : i.index > i.sampleCount / 2
          ? i.index - i.sampleCount
          : i.nyquistPolicy === "positive"
            ? i.index
            : -i.index,
    nyquist: i.sampleCount % 2 === 0 && i.index === i.sampleCount / 2,
  });
};
export const example = {
  input: { index: 4, sampleCount: 8, nyquistPolicy: "negative" },
  output: { result: { signedMode: -4, nyquist: true } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "computational-physics/spectral-mode-nyquist-sign",
  title: "Computational Physics: Spectral Mode Nyquist Sign Tool",
  description:
    "Map one unshifted DFT bin index to a signed integer mode with an explicit even-length Nyquist sign policy; no frequency units or FFT evaluation.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          nyquist: { type: "boolean" },
          signedMode: { type: "number" },
        },
        required: ["nyquist", "signedMode"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
