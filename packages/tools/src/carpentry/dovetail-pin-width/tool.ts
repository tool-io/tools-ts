import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DovetailPinWidthInput = Readonly<{
  readonly jointWidthMm: number;
  readonly endPinWidthMm: number;
  readonly tailCount: number;
  readonly tailWidthMm: number;
}>;
export type DovetailPinWidthOutput = Readonly<{
  readonly interiorPinWidthMm: number;
}>;

export const calculateDovetailPinWidth = (
  x: DovetailPinWidthInput,
): DovetailPinWidthOutput => {
  if (!Number.isFinite(x.jointWidthMm) || x.jointWidthMm < 0)
    simpleError("jointWidthMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.endPinWidthMm) || x.endPinWidthMm < 0)
    simpleError("endPinWidthMm", "Provide a finite number at least 0.");
  if (!Number.isSafeInteger(x.tailCount) || x.tailCount < 2)
    simpleError("tailCount", "Provide a safe integer at least 2.");
  if (!Number.isFinite(x.tailWidthMm) || x.tailWidthMm < 0)
    simpleError("tailWidthMm", "Provide a finite number at least 0.");
  if (!(
    x.tailCount >= 2 &&
    x.jointWidthMm >= 2 * x.endPinWidthMm + x.tailCount * x.tailWidthMm
  ))
    simpleError(
      "jointWidthMm",
      "Joint width must cover all tails and end pins.",
    );
  const interiorPinWidthMm =
    (x.jointWidthMm - 2 * x.endPinWidthMm - x.tailCount * x.tailWidthMm) /
    (x.tailCount - 1);
  if (!Number.isFinite(interiorPinWidthMm))
    simpleError("interiorPinWidthMm", "The inputs produce an invalid result.");
  return {
    interiorPinWidthMm: Object.is(interiorPinWidthMm, -0)
      ? 0
      : interiorPinWidthMm,
  };
};

export const example = {
  input: { jointWidthMm: 100, endPinWidthMm: 5, tailCount: 3, tailWidthMm: 20 },
  output: { interiorPinWidthMm: 15 },
} satisfies ToolExample<DovetailPinWidthInput, DovetailPinWidthOutput>;

export const tool = createSimpleTool({
  id: "carpentry/dovetail-pin-width",
  title: "Dovetail Pin Width",
  description:
    "Solve equal interior pin width from joint width, two end pins, tail count, and equal tail width.",
  inputs: [
    {
      id: "jointWidthMm",
      kind: "number",
      label: "Joint width",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "endPinWidthMm",
      kind: "number",
      label: "Each end pin width",
      unit: "mm",
      minimum: 0,
    },
    { id: "tailCount", kind: "integer", label: "Tail count", minimum: 2 },
    {
      id: "tailWidthMm",
      kind: "number",
      label: "Each tail width",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "interiorPinWidthMm",
      kind: "number",
      label: "Interior pin width",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateDovetailPinWidth({
      jointWidthMm: input.jointWidthMm as number,
      endPinWidthMm: input.endPinWidthMm as number,
      tailCount: input.tailCount as number,
      tailWidthMm: input.tailWidthMm as number,
    }),
});
export const dovetailPinWidthTool = tool;
export const runDovetailPinWidth = tool.execute;
export default tool;
