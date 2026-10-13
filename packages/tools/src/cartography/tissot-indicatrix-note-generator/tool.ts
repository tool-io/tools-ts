import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  positive,
  simpleError,
} from "../batch52-shared.js";
export type Input = Readonly<{
  readonly maximumLocalScale: number;
  readonly minimumLocalScale: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "maximumLocalScale", label: "Maximum local scale", kind: "number" },
  { id: "minimumLocalScale", label: "Minimum local scale", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  positive(i.maximumLocalScale, "major");
  positive(i.minimumLocalScale, "minor");
  if (i.maximumLocalScale < i.minimumLocalScale)
    simpleError("scales", "Major must be >= minor.");
  return {
    localAxisRatio: i.maximumLocalScale / i.minimumLocalScale,
    localAreaFactor: i.maximumLocalScale * i.minimumLocalScale,
    conformalAtPoint: i.maximumLocalScale === i.minimumLocalScale,
  };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { maximumLocalScale: 2, minimumLocalScale: 1 },
  output: {
    result: { localAxisRatio: 2, localAreaFactor: 2, conformalAtPoint: false },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "cartography/tissot-indicatrix-note-generator",
  title:
    "Map Projection Distortion Tissot Indicatrix Ellipse Axes Note Generator",
  description:
    "Summarize caller independently derived Tissot principal scales; does not compute projection derivatives or orientation.",
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
          localAxisRatio: { type: "number" },
          localAreaFactor: { type: "number" },
          conformalAtPoint: { type: "boolean" },
        },
        required: ["localAxisRatio", "localAreaFactor", "conformalAtPoint"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
