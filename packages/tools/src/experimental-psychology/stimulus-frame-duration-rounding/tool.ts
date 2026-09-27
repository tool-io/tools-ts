import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  durationSeconds: number;
  refreshHz: number;
  rounding: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "durationSeconds",
    label: "Duration seconds",
    kind: "number",
    unit: "s",
  },
  { id: "refreshHz", label: "Refresh hz", kind: "number" },
  {
    id: "rounding",
    label: "Rounding",
    kind: "string",
    enum: ["floor", "ceil", "nearest"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.durationSeconds >= 0);
  H.positive(i.refreshHz);
  H.choice(i.rounding, ["floor", "ceil", "nearest"]);
  const raw = i.durationSeconds * i.refreshHz;
  H.check(raw <= 1000000000);
  const frames =
    i.rounding === "floor"
      ? Math.floor(raw)
      : i.rounding === "ceil"
        ? Math.ceil(raw)
        : Math.floor(raw + 0.5);
  return H.finish({
    frames,
    realizedSeconds: frames / i.refreshHz,
    residualSeconds: frames / i.refreshHz - i.durationSeconds,
  });
};
export const example = {
  input: { durationSeconds: 0.025, refreshHz: 60, rounding: "nearest" },
  output: {
    result: {
      frames: 2,
      realizedSeconds: 0.03333333333333333,
      residualSeconds: 0.008333333333333333,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "experimental-psychology/stimulus-frame-duration-rounding",
  title: "Experimental Psychology: Stimulus Frame Duration Rounding Tool",
  description:
    "Quantize one stimulus duration to display frames under explicit floor/ceil/nearest-half-up policy; excludes scheduling, dropped frames and hardware timing guarantees.",
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
          frames: { type: "number" },
          realizedSeconds: { type: "number" },
          residualSeconds: { type: "number" },
        },
        required: ["frames", "realizedSeconds", "residualSeconds"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
