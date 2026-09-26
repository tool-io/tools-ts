import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  sourceVoltage: number;
  sourceResistance: number;
  shuntResistance: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "sourceVoltage", label: "Source voltage", kind: "number" },
  { id: "sourceResistance", label: "Source resistance", kind: "number" },
  { id: "shuntResistance", label: "Shunt resistance", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.positive(i.sourceResistance);
  H.check(i.shuntResistance >= 0);
  const loaded = i.sourceVoltage / (i.sourceResistance + i.shuntResistance);
  return H.finish({
    idealCurrent: i.sourceVoltage / i.sourceResistance,
    loadedCurrent: loaded,
    burdenVoltage: loaded * i.shuntResistance,
    relativeCurrentChange:
      -i.shuntResistance / (i.sourceResistance + i.shuntResistance),
  });
};
export const example = {
  input: { sourceVoltage: 10, sourceResistance: 4, shuntResistance: 1 },
  output: {
    result: {
      idealCurrent: 2.5,
      loadedCurrent: 2,
      burdenVoltage: 2,
      relativeCurrentChange: -0.2,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electricity/shunt-burden-single-reading-error",
  title: "Electricity: Shunt Burden Single Reading Error Tool",
  description:
    "Compute ideal ammeter shunt loading of an explicit Thevenin source, including the series burden and relative current change; no instrument rating or safety claim.",
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
          burdenVoltage: { type: "number" },
          idealCurrent: { type: "number" },
          loadedCurrent: { type: "number" },
          relativeCurrentChange: { type: "number" },
        },
        required: [
          "burdenVoltage",
          "idealCurrent",
          "loadedCurrent",
          "relativeCurrentChange",
        ],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
