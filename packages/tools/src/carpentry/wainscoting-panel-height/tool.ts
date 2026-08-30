import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WainscotingPanelHeightInput = Readonly<{
  readonly finishedTopHeightMm: number;
  readonly baseboardHeightMm: number;
  readonly topCapAllowanceMm: number;
}>;
export type WainscotingPanelHeightOutput = Readonly<{
  readonly panelHeightMm: number;
}>;

export const calculateWainscotingPanelHeight = (
  x: WainscotingPanelHeightInput,
): WainscotingPanelHeightOutput => {
  if (!Number.isFinite(x.finishedTopHeightMm) || x.finishedTopHeightMm < 0)
    simpleError("finishedTopHeightMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.baseboardHeightMm) || x.baseboardHeightMm < 0)
    simpleError("baseboardHeightMm", "Provide a finite number at least 0.");
  if (!Number.isFinite(x.topCapAllowanceMm) || x.topCapAllowanceMm < 0)
    simpleError("topCapAllowanceMm", "Provide a finite number at least 0.");
  if (!(x.finishedTopHeightMm >= x.baseboardHeightMm + x.topCapAllowanceMm))
    simpleError(
      "finishedTopHeightMm",
      "Top elevation must cover trim allowances.",
    );
  const panelHeightMm =
    x.finishedTopHeightMm - x.baseboardHeightMm - x.topCapAllowanceMm;
  if (!Number.isFinite(panelHeightMm))
    simpleError("panelHeightMm", "The inputs produce an invalid result.");
  return { panelHeightMm: Object.is(panelHeightMm, -0) ? 0 : panelHeightMm };
};

export const example = {
  input: {
    finishedTopHeightMm: 1000,
    baseboardHeightMm: 100,
    topCapAllowanceMm: 20,
  },
  output: { panelHeightMm: 880 },
} satisfies ToolExample<
  WainscotingPanelHeightInput,
  WainscotingPanelHeightOutput
>;

export const tool = createSimpleTool({
  id: "carpentry/wainscoting-panel-height",
  title: "Wainscoting Panel Height",
  description:
    "Find exposed wainscoting panel height below a finished top elevation after baseboard and top-cap allowances.",
  inputs: [
    {
      id: "finishedTopHeightMm",
      kind: "number",
      label: "Finished top elevation",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "baseboardHeightMm",
      kind: "number",
      label: "Baseboard height",
      unit: "mm",
      minimum: 0,
    },
    {
      id: "topCapAllowanceMm",
      kind: "number",
      label: "Top-cap allowance",
      unit: "mm",
      minimum: 0,
    },
  ],
  outputs: [
    {
      id: "panelHeightMm",
      kind: "number",
      label: "Exposed panel height",
      unit: "mm",
    },
  ],
  calculate: (input) =>
    calculateWainscotingPanelHeight({
      finishedTopHeightMm: input.finishedTopHeightMm as number,
      baseboardHeightMm: input.baseboardHeightMm as number,
      topCapAllowanceMm: input.topCapAllowanceMm as number,
    }),
});
export const wainscotingPanelHeightTool = tool;
export const runWainscotingPanelHeight = tool.execute;
export default tool;
