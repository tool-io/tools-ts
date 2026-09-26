import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ realPower: number; reactivePower: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "realPower", label: "Real power", kind: "number" },
  { id: "reactivePower", label: "Reactive power", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  return H.finish({
    quadrant:
      i.realPower === 0 || i.reactivePower === 0
        ? 0
        : i.realPower > 0
          ? i.reactivePower > 0
            ? 1
            : 4
          : i.reactivePower > 0
            ? 2
            : 3,
    reactiveSign:
      i.reactivePower === 0
        ? "zero"
        : i.reactivePower > 0
          ? "positive"
          : "negative",
    loadConventionLabel:
      i.realPower <= 0
        ? "not-positive-load"
        : i.reactivePower === 0
          ? "unity"
          : i.reactivePower > 0
            ? "lagging"
            : "leading",
  });
};
export const example = {
  input: { realPower: 3, reactivePower: -2 },
  output: {
    result: {
      quadrant: 4,
      reactiveSign: "negative",
      loadConventionLabel: "leading",
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "electricity/ac-power-leading-lagging-quadrant",
  title: "Electricity: Ac Power Leading Lagging Quadrant Tool",
  description:
    "Label an explicit P/Q operating point under positive-load power convention, refusing a load leading/lagging label for nonpositive real power; no grid-stability judgment.",
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
          loadConventionLabel: { type: "string" },
          quadrant: { type: "number" },
          reactiveSign: { type: "string" },
        },
        required: ["loadConventionLabel", "quadrant", "reactiveSign"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
