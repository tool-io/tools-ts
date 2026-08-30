import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HyperfocalNearLimitInput = Readonly<{
  readonly hyperfocalMillimeters: number;
  readonly focalLengthMillimeters: number;
}>;
export type HyperfocalNearLimitOutput = Readonly<{
  readonly nearLimitMillimeters: number;
}>;

export const calculateHyperfocalNearLimit = (
  x: HyperfocalNearLimitInput,
): HyperfocalNearLimitOutput => {
  if (!Number.isFinite(x.hyperfocalMillimeters) || x.hyperfocalMillimeters < 0)
    simpleError("hyperfocalMillimeters", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.focalLengthMillimeters) ||
    x.focalLengthMillimeters < 0
  )
    simpleError(
      "focalLengthMillimeters",
      "Provide a finite number at least 0.",
    );
  if (x.hyperfocalMillimeters <= x.focalLengthMillimeters)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const nearLimitMillimeters =
    x.hyperfocalMillimeters ** 2 /
    (2 * x.hyperfocalMillimeters - x.focalLengthMillimeters);
  if (!Number.isFinite(nearLimitMillimeters))
    simpleError(
      "nearLimitMillimeters",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    nearLimitMillimeters: Object.is(nearLimitMillimeters, -0)
      ? 0
      : nearLimitMillimeters,
  };
};

export const example = {
  input: { hyperfocalMillimeters: 10000, focalLengthMillimeters: 50 },
  output: { nearLimitMillimeters: 5012.5313283208025 },
} satisfies ToolExample<HyperfocalNearLimitInput, HyperfocalNearLimitOutput>;

export const tool = createSimpleTool({
  id: "film/hyperfocal-near-limit",
  title: "Hyperfocal Near Limit",
  description:
    "Near focus limit when focused at hyperfocal distance: H²/(2H−f), close to H/2 for H≫f.",
  inputs: [
    {
      id: "hyperfocalMillimeters",
      kind: "number",
      label: "Hyperfocal Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "focalLengthMillimeters",
      kind: "number",
      label: "Focal Length Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "nearLimitMillimeters",
      kind: "number",
      label: "Near Limit Millimeters",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateHyperfocalNearLimit({
      hyperfocalMillimeters: input.hyperfocalMillimeters as number,
      focalLengthMillimeters: input.focalLengthMillimeters as number,
    }),
});
export const hyperfocalNearLimitTool = tool;
export const runHyperfocalNearLimit = tool.execute;
export default tool;
