import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  aligned,
  sum,
  unique,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly cellIds: readonly string[];
  readonly cellAreasM2: readonly number[];
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "cellIds", label: "Cell ids", kind: "stringList" },
  { id: "cellAreasM2", label: "Cell areas m2", kind: "numberList" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  aligned(i.cellIds, i.cellAreasM2, "cells");
  unique(i.cellIds, "cells");
  i.cellAreasM2.forEach((v) => positive(v, "area"));
  return { totalUpstreamAreaM2: sum(i.cellAreasM2) };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { cellIds: ["a", "b"], cellAreasM2: [100, 200] },
  output: { result: { totalUpstreamAreaM2: 300 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cartography/drainage-area-summation-upstream",
  title: "Drainage Area Summation Upstream Cells Calculator",
  description:
    "Sum unique caller already delineated upstream cells; does not infer drainage graph, flow direction or watershed connectivity.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { totalUpstreamAreaM2: { type: "number" } },
        required: ["totalUpstreamAreaM2"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
