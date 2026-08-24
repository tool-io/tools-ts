import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type FinfetFinHeightEffectInput = {
  readonly finHeightNm: number;
  readonly finWidthNm: number;
  readonly layoutWidthNm: number;
};

export type FinfetFinHeightEffectOutput = {
  readonly effectiveWidthRatio: number;
  readonly effectiveWidthNm: number;
};

export const finfetFinHeightEffectExample = {
  input: { finHeightNm: 15, finWidthNm: 10, layoutWidthNm: 20 },
  output: { effectiveWidthNm: 40, effectiveWidthRatio: 2 },
} satisfies ToolExample<
  FinfetFinHeightEffectInput,
  FinfetFinHeightEffectOutput
>;

export const calculateFinfetFinHeightEffect = (
  input: FinfetFinHeightEffectInput,
): FinfetFinHeightEffectOutput => {
  if (!Number.isFinite(input.finHeightNm) || input.finHeightNm <= 0)
    simpleError("finHeightNm", "Fin height must be positive.");
  if (!Number.isFinite(input.finWidthNm) || input.finWidthNm <= 0)
    simpleError("finWidthNm", "Fin width must be positive.");
  if (!Number.isFinite(input.layoutWidthNm) || input.layoutWidthNm <= 0)
    simpleError("layoutWidthNm", "Layout width must be positive.");
  const effectiveWidthNm = 2 * input.finHeightNm + input.finWidthNm;
  const effectiveWidthRatio = effectiveWidthNm / input.layoutWidthNm;
  if (
    !Number.isFinite(effectiveWidthNm) ||
    !Number.isFinite(effectiveWidthRatio)
  )
    simpleError(
      "finHeightNm",
      "The effective width is too large to represent.",
    );
  return {
    effectiveWidthNm,
    effectiveWidthRatio,
  };
};

export const finfetFinHeightEffectTool = createSimpleTool({
  calculate: (input) =>
    calculateFinfetFinHeightEffect({
      finHeightNm: input.finHeightNm as number,
      finWidthNm: input.finWidthNm as number,
      layoutWidthNm: input.layoutWidthNm as number,
    }),
  description:
    "Compute the effective channel width of a FinFET from fin geometry and its ratio to the laid-out width.",
  id: "semiconductor/finfet-fin-height-effect",
  inputs: [
    {
      description: "Vertical fin height.",
      id: "finHeightNm",
      kind: "number",
      label: "Fin height",
      minimum: Number.MIN_VALUE,
      unit: "nm",
    },
    {
      description: "Drawn layout width of the device.",
      id: "layoutWidthNm",
      kind: "number",
      label: "Layout width",
      minimum: Number.MIN_VALUE,
      unit: "nm",
    },
    {
      description: "Horizontal fin width.",
      id: "finWidthNm",
      kind: "number",
      label: "Fin width",
      minimum: Number.MIN_VALUE,
      unit: "nm",
    },
  ],
  outputs: [
    {
      description:
        "Effective channel width divided by the comparison layout width.",
      id: "effectiveWidthRatio",
      kind: "number",
      label: "Effective width ratio",
      minimum: Number.MIN_VALUE,
      unit: "ratio",
    },
    {
      description: "Effective electrical channel width.",
      id: "effectiveWidthNm",
      kind: "number",
      label: "Effective width",
      minimum: Number.MIN_VALUE,
      unit: "nm",
    },
  ],
  title: "FinFET Effective Width Calculator",
});
export const runFinfetFinHeightEffect = finfetFinHeightEffectTool.execute;
export default finfetFinHeightEffectTool;
