import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ClampCountInput = Readonly<{
  readonly requiredTotalForceN: number;
  readonly usableForcePerClampN: number;
}>;
export type ClampCountOutput = Readonly<{
  readonly clampCount: number;
}>;

export const calculateClampCount = (x: ClampCountInput): ClampCountOutput => {
  if (!Number.isFinite(x.requiredTotalForceN) || x.requiredTotalForceN < 0)
    simpleError("requiredTotalForceN", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.usableForcePerClampN) || x.usableForcePerClampN < 0)
    simpleError("usableForcePerClampN", "Provide a finite number at least 0.");
  if (!(x.usableForcePerClampN > 0))
    simpleError(
      "usableForcePerClampN",
      "Usable force per clamp must be positive.",
    );
  const clampCount = Math.ceil(x.requiredTotalForceN / x.usableForcePerClampN);
  if (!Number.isFinite(clampCount) || !Number.isSafeInteger(clampCount))
    simpleError("clampCount", "The inputs produce an invalid result.");
  return { clampCount: Object.is(clampCount, -0) ? 0 : clampCount };
};

export const example = {
  input: { requiredTotalForceN: 1000, usableForcePerClampN: 300 },
  output: { clampCount: 4 },
} satisfies ToolExample<ClampCountInput, ClampCountOutput>;

export const tool = createSimpleTool({
  id: "carpentry/clamp-count",
  title: "Clamp Count",
  description:
    "Round up clamp count from total target clamping force and the usable force rating per clamp at the actual setup.",
  inputs: [
    {
      id: "requiredTotalForceN",
      kind: "number",
      label: "Total target clamping force",
      unit: "N",
      minimum: 0,
    },
    {
      id: "usableForcePerClampN",
      kind: "number",
      label: "Usable force per clamp",
      unit: "N",
      minimum: 0,
    },
  ],
  outputs: [{ id: "clampCount", kind: "integer", label: "Clamps required" }],
  calculate: (input) =>
    calculateClampCount({
      requiredTotalForceN: input.requiredTotalForceN as number,
      usableForcePerClampN: input.usableForcePerClampN as number,
    }),
});
export const clampCountTool = tool;
export const runClampCount = tool.execute;
export default tool;
