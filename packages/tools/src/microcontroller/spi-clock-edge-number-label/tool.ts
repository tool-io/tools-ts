import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ clockPolarity: number; clockPhase: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "clockPolarity", label: "Clock polarity", kind: "integer" },
  { id: "clockPhase", label: "Clock phase", kind: "integer" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.int(i.clockPolarity, 0, 1);
  H.int(i.clockPhase, 0, 1);
  return H.finish({
    idleLevel: i.clockPolarity,
    leadingEdge: i.clockPolarity === 0 ? "rising" : "falling",
    sampleEdgeNumber: i.clockPhase === 0 ? 1 : 2,
    shiftEdgeNumber: i.clockPhase === 0 ? 2 : 1,
    mode: 2 * i.clockPolarity + i.clockPhase,
  });
};
export const example = {
  input: { clockPolarity: 0, clockPhase: 1 },
  output: {
    result: {
      idleLevel: 0,
      leadingEdge: "rising",
      sampleEdgeNumber: 2,
      shiftEdgeNumber: 1,
      mode: 1,
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "microcontroller/spi-clock-edge-number-label",
  title: "Microcontroller: SPI Clock Edge Number Label Tool",
  description:
    "Label SPI CPOL/CPHA mode sampling/shift edge order under the conventional Motorola modes0..3; excludes device timing margins.",
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
          idleLevel: { type: "number" },
          leadingEdge: { type: "string" },
          mode: { type: "number" },
          sampleEdgeNumber: { type: "number" },
          shiftEdgeNumber: { type: "number" },
        },
        required: [
          "idleLevel",
          "leadingEdge",
          "mode",
          "sampleEdgeNumber",
          "shiftEdgeNumber",
        ],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
