import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type RebarChairSpacingInput = Readonly<{
  readonly runLengthM: number;
  readonly maximumSpacingM: number;
}>;
export type RebarChairSpacingOutput = Readonly<{
  readonly chairCount: number;
}>;

export const calculateRebarChairSpacing = (
  x: RebarChairSpacingInput,
): RebarChairSpacingOutput => {
  if (!Number.isFinite(x.runLengthM) || x.runLengthM < 0)
    simpleError("runLengthM", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.maximumSpacingM) || x.maximumSpacingM < 0)
    simpleError("maximumSpacingM", "Provide a finite number at least 0.");
  if (!(x.maximumSpacingM > 0))
    simpleError("maximumSpacingM", "Maximum spacing must be positive.");
  const chairCount = Math.ceil(x.runLengthM / x.maximumSpacingM) + 1;
  if (!Number.isFinite(chairCount) || !Number.isSafeInteger(chairCount))
    simpleError("chairCount", "The inputs produce an invalid result.");
  return { chairCount: Object.is(chairCount, -0) ? 0 : chairCount };
};

export const example = {
  input: { runLengthM: 5, maximumSpacingM: 1 },
  output: { chairCount: 6 },
} satisfies ToolExample<RebarChairSpacingInput, RebarChairSpacingOutput>;

export const tool = createSimpleTool({
  id: "construction/rebar-chair-spacing",
  title: "Rebar Chair Spacing",
  description:
    "Count support chairs along one rebar line including both ends, with no gap exceeding the chosen maximum spacing.",
  inputs: [
    {
      id: "runLengthM",
      kind: "number",
      label: "Supported run",
      unit: "m",
      minimum: 0,
    },
    {
      id: "maximumSpacingM",
      kind: "number",
      label: "Maximum chair spacing",
      unit: "m",
      minimum: 0,
    },
  ],
  outputs: [{ id: "chairCount", kind: "integer", label: "Chairs along run" }],
  calculate: (input) =>
    calculateRebarChairSpacing({
      runLengthM: input.runLengthM as number,
      maximumSpacingM: input.maximumSpacingM as number,
    }),
});
export const rebarChairSpacingTool = tool;
export const runRebarChairSpacing = tool.execute;
export default tool;
