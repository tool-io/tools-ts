import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type JoistHangerCountInput = Readonly<{
  readonly joistCount: number;
  readonly hangerEndsPerJoist: number;
}>;
export type JoistHangerCountOutput = Readonly<{ hangerCount: number }>;

export const calculateJoistHangerCount = (
  i: JoistHangerCountInput,
): JoistHangerCountOutput => {
  if (i.hangerEndsPerJoist > 2)
    simpleError("hangerEndsPerJoist", "A joist has at most two ends.");
  const value = i.joistCount * i.hangerEndsPerJoist;
  if (!Number.isFinite(value))
    simpleError("hangerCount", "The inputs produce a non-finite result.");
  return { hangerCount: Object.is(value, -0) ? 0 : value };
};

export const example = {
  input: { joistCount: 20, hangerEndsPerJoist: 2 },
  output: { hangerCount: 40 },
} satisfies ToolExample<JoistHangerCountInput, JoistHangerCountOutput>;

export const tool = createSimpleTool({
  id: "construction/joist-hanger-count",
  title: "Joist Hanger Count",
  description:
    "Calculate joist hanger count from an integer number of joists and hanger-supported ends per joist; a joist may need zero, one, or two hangers.",
  inputs: [
    { id: "joistCount", kind: "integer", label: "Joist Count", minimum: 0 },
    {
      id: "hangerEndsPerJoist",
      kind: "integer",
      label: "Hanger Ends Per Joist",
      minimum: 0,
    },
  ],
  outputs: [{ id: "hangerCount", kind: "integer", label: "Hanger Count" }],
  calculate: (input) =>
    calculateJoistHangerCount({
      joistCount: input.joistCount as number,
      hangerEndsPerJoist: input.hangerEndsPerJoist as number,
    }),
});
export const joistHangerCountTool = tool;
export const runJoistHangerCount = tool.execute;
export default tool;
