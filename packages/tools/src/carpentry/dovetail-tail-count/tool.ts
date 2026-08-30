import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DovetailTailCountInput = Readonly<{
  readonly jointWidthMm: number;
  readonly endPinWidthMm: number;
  readonly tailWidthMm: number;
  readonly interiorPinWidthMm: number;
}>;
export type DovetailTailCountOutput = Readonly<{
  readonly tailCount: number;
}>;

export const calculateDovetailTailCount = (
  x: DovetailTailCountInput,
): DovetailTailCountOutput => {
  if (!Number.isFinite(x.jointWidthMm) || x.jointWidthMm < 0)
    simpleError("jointWidthMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.endPinWidthMm) || x.endPinWidthMm < 0)
    simpleError("endPinWidthMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.tailWidthMm) || x.tailWidthMm < 0)
    simpleError("tailWidthMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.interiorPinWidthMm) || x.interiorPinWidthMm < 0)
    simpleError("interiorPinWidthMm", "Provide a finite number at least 0.");
  if (!(
    x.tailWidthMm > 0 && x.jointWidthMm >= 2 * x.endPinWidthMm + x.tailWidthMm
  ))
    simpleError("input", "A positive-width tail must fit between end pins.");
  const tailCount = Math.floor(
    (x.jointWidthMm - 2 * x.endPinWidthMm + x.interiorPinWidthMm) /
      (x.tailWidthMm + x.interiorPinWidthMm),
  );
  if (!Number.isFinite(tailCount) || !Number.isSafeInteger(tailCount))
    simpleError("tailCount", "The inputs produce an invalid result.");
  return { tailCount: Object.is(tailCount, -0) ? 0 : tailCount };
};

export const example = {
  input: {
    jointWidthMm: 100,
    endPinWidthMm: 5,
    tailWidthMm: 15,
    interiorPinWidthMm: 5,
  },
  output: { tailCount: 4 },
} satisfies ToolExample<DovetailTailCountInput, DovetailTailCountOutput>;

export const tool = createSimpleTool({
  id: "carpentry/dovetail-tail-count",
  title: "Dovetail Tail Count",
  description:
    "Count complete dovetail tails that fit an available joint width after reserving equal end pins and interior pin widths.",
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
      label: "Each end pin",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "tailWidthMm",
      kind: "number",
      label: "Target tail width",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "interiorPinWidthMm",
      kind: "number",
      label: "Interior pin width",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [{ id: "tailCount", kind: "integer", label: "Complete tails" }],
  calculate: (input) =>
    calculateDovetailTailCount({
      jointWidthMm: input.jointWidthMm as number,
      endPinWidthMm: input.endPinWidthMm as number,
      tailWidthMm: input.tailWidthMm as number,
      interiorPinWidthMm: input.interiorPinWidthMm as number,
    }),
});
export const dovetailTailCountTool = tool;
export const runDovetailTailCount = tool.execute;
export default tool;
