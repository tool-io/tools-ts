import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
  bounded,
  simpleError,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly roomM3: number;
  readonly observedPpm: number;
  readonly callerTargetPpm: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "roomM3", label: "Room m3", kind: "number" },
  { id: "observedPpm", label: "Observed ppm", kind: "number" },
  { id: "callerTargetPpm", label: "Caller target ppm", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input): Readonly<Record<string, unknown>> => {
  positive(i.roomM3, "room");
  nonnegative(i.observedPpm, "ppm");
  nonnegative(i.callerTargetPpm, "ppm");
  if (Math.max(i.observedPpm, i.callerTargetPpm) > 1e6)
    simpleError("ppm", "Volume fractions bounded by 1e6 ppm.");
  return {
    signedCo2VolumeM3: i.roomM3 * (i.callerTargetPpm - i.observedPpm) * 1e-6,
  };
};
export const calculate = (i: Input): Output => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { roomM3: 100, observedPpm: 400, callerTargetPpm: 800 },
  output: { result: { signedCo2VolumeM3: 0.04 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "horticulture/co2-enrichment-setpoint-ppm",
  title: "CO2 Enrichment Setpoint PPM Calculator",
  description:
    "Signed ideal well-mixed CO2 volume difference to independently selected setpoint; no health-safe exposure or ventilation design.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
