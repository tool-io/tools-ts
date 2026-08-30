import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type LinkPenaltyInput = Readonly<{
  readonly impairedSensitivityDbm: number;
  readonly baselineSensitivityDbm: number;
}>;
export type LinkPenaltyOutput = Readonly<{
  readonly linkPenaltyDb: number;
}>;

export const calculateLinkPenalty = (
  x: LinkPenaltyInput,
): LinkPenaltyOutput => {
  if (!Number.isFinite(x.impairedSensitivityDbm))
    simpleError("impairedSensitivityDbm", "Provide a finite number.");
  if (!Number.isFinite(x.baselineSensitivityDbm))
    simpleError("baselineSensitivityDbm", "Provide a finite number.");
  if (!(x.impairedSensitivityDbm >= x.baselineSensitivityDbm))
    simpleError(
      "impairedSensitivityDbm",
      "Impaired sensitivity must require at least baseline power.",
    );
  const linkPenaltyDb = x.impairedSensitivityDbm - x.baselineSensitivityDbm;
  if (!Number.isFinite(linkPenaltyDb))
    simpleError("linkPenaltyDb", "The inputs produce an invalid result.");
  return { linkPenaltyDb: Object.is(linkPenaltyDb, -0) ? 0 : linkPenaltyDb };
};

export const example = {
  input: { impairedSensitivityDbm: -17, baselineSensitivityDbm: -20 },
  output: { linkPenaltyDb: 3 },
} satisfies ToolExample<LinkPenaltyInput, LinkPenaltyOutput>;

export const tool = createSimpleTool({
  id: "electronics/link-penalty",
  title: "Link Penalty",
  description:
    "Compute receiver power penalty as impaired minus baseline sensitivity, with both measurements in dBm at the same error-rate target.",
  inputs: [
    {
      id: "impairedSensitivityDbm",
      kind: "number",
      label: "Sensitivity with impairments",
      unit: "dBm",
    },
    {
      id: "baselineSensitivityDbm",
      kind: "number",
      label: "Baseline sensitivity",
      unit: "dBm",
    },
  ],
  outputs: [
    {
      id: "linkPenaltyDb",
      kind: "number",
      label: "Required-power penalty",
      unit: "dB",
    },
  ],
  calculate: (input) =>
    calculateLinkPenalty({
      impairedSensitivityDbm: input.impairedSensitivityDbm as number,
      baselineSensitivityDbm: input.baselineSensitivityDbm as number,
    }),
});
export const linkPenaltyTool = tool;
export const runLinkPenalty = tool.execute;
export default tool;
