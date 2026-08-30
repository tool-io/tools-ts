import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type BoxOfficeGrossPerScreenInput = Readonly<{
  readonly grossCurrencyUnits: number;
  readonly screenCount: number;
}>;
export type BoxOfficeGrossPerScreenOutput = Readonly<{
  readonly grossPerScreen: number;
}>;

export const calculateBoxOfficeGrossPerScreen = (
  x: BoxOfficeGrossPerScreenInput,
): BoxOfficeGrossPerScreenOutput => {
  if (!Number.isFinite(x.grossCurrencyUnits) || x.grossCurrencyUnits < 0)
    simpleError("grossCurrencyUnits", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.screenCount) || x.screenCount < 1)
    simpleError("screenCount", "Provide a finite number at least 1.");
  if (!Number.isSafeInteger(x.screenCount))
    simpleError("input", "Inputs violate the stated model or operating range.");
  const grossPerScreen = x.grossCurrencyUnits / x.screenCount;
  if (!Number.isFinite(grossPerScreen))
    simpleError(
      "grossPerScreen",
      "Inputs produce an undefined or out-of-range result.",
    );
  return { grossPerScreen: Object.is(grossPerScreen, -0) ? 0 : grossPerScreen };
};

export const example = {
  input: { grossCurrencyUnits: 1000000, screenCount: 100 },
  output: { grossPerScreen: 10000 },
} satisfies ToolExample<
  BoxOfficeGrossPerScreenInput,
  BoxOfficeGrossPerScreenOutput
>;

export const tool = createSimpleTool({
  id: "film/box-office-gross-per-screen",
  title: "Box Office Gross Per Screen",
  description:
    "Gross theatrical receipts per playing screen from a total gross and positive screen count.",
  inputs: [
    {
      id: "grossCurrencyUnits",
      kind: "number",
      label: "Gross Currency Units",
      unit: "currency",
      minimum: 0,
    },
    { id: "screenCount", kind: "integer", label: "Screen Count", minimum: 1 },
  ],
  outputs: [
    {
      id: "grossPerScreen",
      kind: "number",
      label: "Gross Per Screen",
      unit: "currency/screen",
    },
  ],
  calculate: (input) =>
    calculateBoxOfficeGrossPerScreen({
      grossCurrencyUnits: input.grossCurrencyUnits as number,
      screenCount: input.screenCount as number,
    }),
});
export const boxOfficeGrossPerScreenTool = tool;
export const runBoxOfficeGrossPerScreen = tool.execute;
export default tool;
