import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  voltageReal: number;
  voltageImaginary: number;
  currentReal: number;
  currentImaginary: number;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "voltageReal", label: "Voltage real", kind: "number" },
  { id: "voltageImaginary", label: "Voltage imaginary", kind: "number" },
  { id: "currentReal", label: "Current real", kind: "number" },
  { id: "currentImaginary", label: "Current imaginary", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({
    realPower:
      i.voltageReal * i.currentReal + i.voltageImaginary * i.currentImaginary,
    reactivePower:
      i.voltageImaginary * i.currentReal - i.voltageReal * i.currentImaginary,
  });
};
export const example = {
  input: {
    voltageReal: 2,
    voltageImaginary: 0,
    currentReal: 3,
    currentImaginary: -1,
  },
  output: { result: { realPower: 6, reactivePower: 2 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electricity/complex-power-real-imaginary-pair",
  title: "Electricity: Complex Power Real Imaginary Pair Tool",
  description:
    "Compute RMS complex power V*conjugate(I) from one explicit voltage/current phasor pair under the passive load convention.",
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
          reactivePower: { type: "number" },
          realPower: { type: "number" },
        },
        required: ["reactivePower", "realPower"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
