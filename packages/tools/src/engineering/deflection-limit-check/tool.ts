import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DeflectionLimitCheckInput = Readonly<{
  readonly deflectionMillimeters: number;
  readonly spanMillimeters: number;
  readonly allowableDeflectionMillimeters: number;
}>;
export type DeflectionLimitCheckOutput = Readonly<{
  readonly deflectionToSpanRatio: number;
  readonly withinLimit: boolean;
}>;

export const calculateDeflectionLimitCheck = (
  x: DeflectionLimitCheckInput,
): DeflectionLimitCheckOutput => {
  if (!Number.isFinite(x.deflectionMillimeters) || x.deflectionMillimeters < 0)
    simpleError("deflectionMillimeters", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.spanMillimeters) || x.spanMillimeters < 0)
    simpleError("spanMillimeters", "Provide a finite number at least 0.");
  if (
    !Number.isFinite(x.allowableDeflectionMillimeters) ||
    x.allowableDeflectionMillimeters < 0
  )
    simpleError(
      "allowableDeflectionMillimeters",
      "Provide a finite number at least 0.",
    );
  const deflectionToSpanRatio = x.deflectionMillimeters / x.spanMillimeters;
  if (!Number.isFinite(deflectionToSpanRatio))
    simpleError(
      "deflectionToSpanRatio",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    deflectionToSpanRatio: Object.is(deflectionToSpanRatio, -0)
      ? 0
      : deflectionToSpanRatio,
    withinLimit: x.deflectionMillimeters <= x.allowableDeflectionMillimeters,
  };
};

export const example = {
  input: {
    deflectionMillimeters: 10,
    spanMillimeters: 3000,
    allowableDeflectionMillimeters: 12,
  },
  output: { deflectionToSpanRatio: 0.0033333333333333335, withinLimit: true },
} satisfies ToolExample<DeflectionLimitCheckInput, DeflectionLimitCheckOutput>;

export const tool = createSimpleTool({
  id: "engineering/deflection-limit-check",
  title: "Deflection Limit Check",
  description:
    "Compare measured beam deflection with a supplied project-specific allowable deflection; also report the deflection-to-span ratio. This does not determine the allowable limit.",
  inputs: [
    {
      id: "deflectionMillimeters",
      kind: "number",
      label: "Deflection Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "spanMillimeters",
      kind: "number",
      label: "Span Millimeters",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "allowableDeflectionMillimeters",
      kind: "number",
      label: "Allowable Deflection Millimeters",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "deflectionToSpanRatio",
      kind: "number",
      label: "Deflection To Span Ratio",
    },
    { id: "withinLimit", kind: "boolean", label: "Within Limit" },
  ],
  calculate: (input) =>
    calculateDeflectionLimitCheck({
      deflectionMillimeters: input.deflectionMillimeters as number,
      spanMillimeters: input.spanMillimeters as number,
      allowableDeflectionMillimeters:
        input.allowableDeflectionMillimeters as number,
    }),
});
export const deflectionLimitCheckTool = tool;
export const runDeflectionLimitCheck = tool.execute;
export default tool;
