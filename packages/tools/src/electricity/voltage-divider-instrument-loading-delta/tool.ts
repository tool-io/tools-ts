import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  supplyVoltage: number;
  upperResistance: number;
  lowerResistance: number;
  meterResistance: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "supplyVoltage", label: "Supply voltage", kind: "number" },
  { id: "upperResistance", label: "Upper resistance", kind: "number" },
  { id: "lowerResistance", label: "Lower resistance", kind: "number" },
  { id: "meterResistance", label: "Meter resistance", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  [i.upperResistance, i.lowerResistance, i.meterResistance].forEach(H.positive);
  const lower = 1 / (1 / i.lowerResistance + 1 / i.meterResistance),
    unloaded =
      (i.supplyVoltage * i.lowerResistance) /
      (i.upperResistance + i.lowerResistance),
    loaded = (i.supplyVoltage * lower) / (i.upperResistance + lower);
  return H.finish({
    unloadedVoltage: unloaded,
    loadedVoltage: loaded,
    loadingDelta: loaded - unloaded,
  });
};
export const example = {
  input: {
    supplyVoltage: 12,
    upperResistance: 1000,
    lowerResistance: 1000,
    meterResistance: 1000,
  },
  output: {
    result: { unloadedVoltage: 6, loadedVoltage: 4, loadingDelta: -2 },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electricity/voltage-divider-instrument-loading-delta",
  title: "Electricity: Voltage Divider Instrument Loading Delta Tool",
  description:
    "Compute the ideal resistive-divider measurement loading change caused by finite parallel meter resistance; no instrument safety or transient response.",
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
          loadedVoltage: { type: "number" },
          loadingDelta: { type: "number" },
          unloadedVoltage: { type: "number" },
        },
        required: ["loadedVoltage", "loadingDelta", "unloadedVoltage"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
