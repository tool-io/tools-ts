import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import {
  validateInput,
  finish,
  simpleError,
  positive,
} from "../batch49-shared.js";
export type Input = Readonly<{
  readonly actualFrameOuterWidthMm: number;
  readonly actualSideRebateDepthMm: number;
}>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  {
    id: "actualFrameOuterWidthMm",
    label: "Actual frame outer width mm",
    kind: "number",
  },
  {
    id: "actualSideRebateDepthMm",
    label: "Actual side rebate depth mm",
    kind: "number",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input) => {
  positive(input.actualFrameOuterWidthMm, "actualFrameOuterWidthMm");
  positive(input.actualSideRebateDepthMm, "actualSideRebateDepthMm");
  if (input.actualFrameOuterWidthMm <= 2 * input.actualSideRebateDepthMm)
    simpleError("frame", "Actualpositiveclearwidth.");
  return {
    value: input.actualFrameOuterWidthMm - 2 * input.actualSideRebateDepthMm,
  };
};
export const calculate = (input: Input) => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualFrameOuterWidthMm: 100, actualSideRebateDepthMm: 10 },
  output: { result: { value: 80 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "carpentry/zargen-falzmass",
  title: "Zargen Falzma\u00df Calculator",
  description:
    "Declared paired symmetric frame-side rebates clear inner width outer minus2depth, no DIN profile dimensions inferred. Actual independently verified stock/tool/hardware, matching units and applicability; not safe machine setting, capacity certification, code compliance or automatically approved fabrication.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",

      schema: {
        type: "object",
        additionalProperties: false,
        properties: { value: { type: "number" } },
        required: ["value"],
      },
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
