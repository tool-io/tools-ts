import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ lowerPressure: number; upperPressure: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "lowerPressure", label: "Lower pressure", kind: "number" },
  { id: "upperPressure", label: "Upper pressure", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.lowerPressure > i.upperPressure && i.upperPressure > 0);
  return H.finish({
    logMeanPressure:
      (i.lowerPressure - i.upperPressure) /
      (Math.log(i.lowerPressure) - Math.log(i.upperPressure)),
  });
};
export const example = {
  input: { lowerPressure: 100, upperPressure: 50 },
  output: { result: { logMeanPressure: 72.13475204444818 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "atmospheric-science/pressure-thickness-log-layer-mean",
  title: "Atmospheric Science: Pressure Thickness Log Layer Mean Tool",
  description:
    "Compute the logarithmic pressure mean of a positive nonzero layer thickness; this is not an arithmetic midpoint, altitude or hypsometric temperature estimate.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { logMeanPressure: { type: "number" } },
        required: ["logMeanPressure"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
