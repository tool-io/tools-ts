import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, positive, bounded } from "../batch52-shared.js";
export type Input = Readonly<{
  readonly bufferFrames: number;
  readonly framesPerSecond: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "bufferFrames", label: "Buffer frames", kind: "number" },
  { id: "framesPerSecond", label: "Frames per second", kind: "number" },
] as const satisfies readonly SimpleField[];
const compute = (i: Input) => {
  bounded(i.bufferFrames, "frames", 0, 1000000);
  positive(i.framesPerSecond, "fps");
  return { windowMilliseconds: (1000 * i.bufferFrames) / i.framesPerSecond };
};
export const calculate = (i: Input) => {
  validateInput(i, fields);
  return finish({ result: compute(i) });
};
export const example = {
  input: { bufferFrames: 6, framesPerSecond: 60 },
  output: { result: { windowMilliseconds: 100 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "game/input-buffer-window-frames-converter",
  title: "Input Buffer Window Frames Converter",
  description:
    "Actual frame-based input buffer window duration, not network latency or guaranteed input acceptance.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculation or explicitly qualified result",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { windowMilliseconds: { type: "number" } },
        required: ["windowMilliseconds"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
