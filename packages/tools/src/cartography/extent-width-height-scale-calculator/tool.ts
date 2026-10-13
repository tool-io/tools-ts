import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  nonnegative,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly groundWidthM: number;
  readonly groundHeightM: number;
  readonly scaleDenominator: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "groundWidthM", label: "Ground width m", kind: "number" },
  { id: "groundHeightM", label: "Ground height m", kind: "number" },
  { id: "scaleDenominator", label: "Scale denominator", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  nonnegative(i.groundWidthM, "width");
  nonnegative(i.groundHeightM, "height");
  positive(i.scaleDenominator, "scale");
  return {
    mapWidthMm: (1000 * i.groundWidthM) / i.scaleDenominator,
    mapHeightMm: (1000 * i.groundHeightM) / i.scaleDenominator,
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { groundWidthM: 1000, groundHeightM: 2000, scaleDenominator: 10000 },
  output: { result: { mapWidthMm: 100, mapHeightMm: 200 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cartography/extent-width-height-scale-calculator",
  title: "Map Extent Width Height from Bounds at Scale Calculator",
  description:
    "Projected rectangular ground extent to print dimensions under constant representative fraction; no latitude/longitude distance conversion.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          mapWidthMm: { type: "number" },
          mapHeightMm: { type: "number" },
        },
        required: ["mapWidthMm", "mapHeightMm"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
