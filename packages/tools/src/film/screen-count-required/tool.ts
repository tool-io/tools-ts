import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type ScreenCountRequiredInput = Readonly<{
  readonly targetGrossCurrencyUnits: number;
  readonly averageGrossPerScreen: number;
}>;
export type ScreenCountRequiredOutput = Readonly<{
  readonly requiredScreens: number;
}>;

export const calculateScreenCountRequired = (
  x: ScreenCountRequiredInput,
): ScreenCountRequiredOutput => {
  if (
    !Number.isFinite(x.targetGrossCurrencyUnits) ||
    x.targetGrossCurrencyUnits < 0
  )
    simpleError(
      "targetGrossCurrencyUnits",
      "Provide a finite number at least 0.",
    );
  if (!Number.isFinite(x.averageGrossPerScreen) || x.averageGrossPerScreen < 0)
    simpleError("averageGrossPerScreen", "Provide a finite number at least 0.");
  const requiredScreens = Math.ceil(
    x.targetGrossCurrencyUnits / x.averageGrossPerScreen,
  );
  if (!Number.isFinite(requiredScreens))
    simpleError(
      "requiredScreens",
      "Inputs produce an undefined or out-of-range result.",
    );
  return {
    requiredScreens: Object.is(requiredScreens, -0) ? 0 : requiredScreens,
  };
};

export const example = {
  input: { targetGrossCurrencyUnits: 1000000, averageGrossPerScreen: 10000 },
  output: { requiredScreens: 100 },
} satisfies ToolExample<ScreenCountRequiredInput, ScreenCountRequiredOutput>;

export const tool = createSimpleTool({
  id: "film/screen-count-required",
  title: "Screen Count Required",
  description:
    "Minimum whole screens needed to meet a target gross under a supplied average gross per screen.",
  inputs: [
    {
      id: "targetGrossCurrencyUnits",
      kind: "number",
      label: "Target Gross Currency Units",
      unit: "currency",
      minimum: 0,
    },
    {
      id: "averageGrossPerScreen",
      kind: "number",
      label: "Average Gross Per Screen",
      unit: "currency/screen",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "requiredScreens",
      kind: "number",
      label: "Required Screens",
      unit: "screen",
    },
  ],
  calculate: (input) =>
    calculateScreenCountRequired({
      targetGrossCurrencyUnits: input.targetGrossCurrencyUnits as number,
      averageGrossPerScreen: input.averageGrossPerScreen as number,
    }),
});
export const screenCountRequiredTool = tool;
export const runScreenCountRequired = tool.execute;
export default tool;
