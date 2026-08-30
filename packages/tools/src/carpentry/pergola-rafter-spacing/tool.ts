import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type PergolaRafterSpacingInput = Readonly<{
  readonly spanMillimeters: number;
  readonly rafterCount: number;
}>;
export type PergolaRafterSpacingOutput = Readonly<{
  readonly centerSpacingMillimeters: number;
}>;

export const calculatePergolaRafterSpacing = (
  x: PergolaRafterSpacingInput,
): PergolaRafterSpacingOutput => {
  if (!Number.isFinite(x.spanMillimeters) || x.spanMillimeters < 0)
    simpleError("spanMillimeters", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.rafterCount) ||
    !Number.isSafeInteger(x.rafterCount) ||
    x.rafterCount < 0
  )
    simpleError("rafterCount", "Provide a safe integer at least 0.");
  if (!Number.isSafeInteger(x.rafterCount) || x.rafterCount < 2)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const centerSpacingMillimeters = x.spanMillimeters / (x.rafterCount - 1);
  if (!Number.isFinite(centerSpacingMillimeters))
    simpleError(
      "centerSpacingMillimeters",
      "Inputs produce an undefined or non-finite result.",
    );
  return {
    centerSpacingMillimeters: Object.is(centerSpacingMillimeters, -0)
      ? 0
      : centerSpacingMillimeters,
  };
};

export const example = {
  input: { spanMillimeters: 2400, rafterCount: 5 },
  output: { centerSpacingMillimeters: 600 },
} satisfies ToolExample<PergolaRafterSpacingInput, PergolaRafterSpacingOutput>;

export const tool = createSimpleTool({
  id: "carpentry/pergola-rafter-spacing",
  title: "Pergola Rafter Spacing",
  description:
    "Equal center-to-center spacing for rafters whose first and last centers are fixed at the ends of a span.",
  inputs: [
    {
      id: "spanMillimeters",
      kind: "number",
      label: "Span Millimeters",
      unit: "mm",
      minimum: 0,
    },
    { id: "rafterCount", kind: "integer", label: "Rafter Count", minimum: 0 },
  ],
  outputs: [
    {
      id: "centerSpacingMillimeters",
      kind: "number",
      label: "Center Spacing Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculatePergolaRafterSpacing({
      spanMillimeters: input.spanMillimeters as number,
      rafterCount: input.rafterCount as number,
    }),
});
export const pergolaRafterSpacingTool = tool;
export const runPergolaRafterSpacing = tool.execute;
export default tool;
