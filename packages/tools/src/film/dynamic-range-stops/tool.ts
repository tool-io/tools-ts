import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DynamicRangeStopsInput = Readonly<{
  readonly maximumSignal: number;
  readonly minimumSignal: number;
}>;
export type DynamicRangeStopsOutput = Readonly<{
  readonly dynamicRangeStops: number;
}>;

export const calculateDynamicRangeStops = (
  x: DynamicRangeStopsInput,
): DynamicRangeStopsOutput => {
  if (!Number.isFinite(x.maximumSignal) || x.maximumSignal < 0)
    simpleError("maximumSignal", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.minimumSignal) || x.minimumSignal < 0)
    simpleError("minimumSignal", "Provide a finite number at least 0.");
  if (x.maximumSignal < x.minimumSignal)
    simpleError("input", "Inputs violate the stated model or operating range.");
  const dynamicRangeStops = Math.log2(x.maximumSignal / x.minimumSignal);
  if (!Number.isFinite(dynamicRangeStops))
    simpleError(
      "dynamicRangeStops",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    dynamicRangeStops: Object.is(dynamicRangeStops, -0) ? 0 : dynamicRangeStops,
  };
};

export const example = {
  input: { maximumSignal: 1024, minimumSignal: 1 },
  output: { dynamicRangeStops: 10 },
} satisfies ToolExample<DynamicRangeStopsInput, DynamicRangeStopsOutput>;

export const tool = createSimpleTool({
  id: "film/dynamic-range-stops",
  title: "Dynamic Range Stops",
  description:
    "Dynamic range in photographic stops from maximum usable signal divided by minimum usable signal.",
  inputs: [
    {
      id: "maximumSignal",
      kind: "number",
      label: "Maximum Signal",
      minimum: 0,
    },
    {
      id: "minimumSignal",
      kind: "number",
      label: "Minimum Signal",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "dynamicRangeStops",
      kind: "number",
      label: "Dynamic Range Stops",
      unit: "stops",
    },
  ],
  calculate: (input) =>
    calculateDynamicRangeStops({
      maximumSignal: input.maximumSignal as number,
      minimumSignal: input.minimumSignal as number,
    }),
});
export const dynamicRangeStopsTool = tool;
export const runDynamicRangeStops = tool.execute;
export default tool;
