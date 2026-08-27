import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type QSystemRatingInput = {
  readonly rqdPercent?: number;
  readonly jointSetNumberJn?: number;
  readonly jointRoughnessJr?: number;
  readonly jointAlterationJa?: number;
  readonly jointWaterReductionJw?: number;
  readonly stressReductionFactorSrf?: number;
};

export type QSystemRatingOutput = {
  readonly qValue: number;
};

export const calculateQSystemRating = (
  input: QSystemRatingInput,
): QSystemRatingOutput => {
  const rqdPercent = input.rqdPercent ?? 75;
  const jointSetNumberJn = input.jointSetNumberJn ?? 9;
  const jointRoughnessJr = input.jointRoughnessJr ?? 1;
  const jointAlterationJa = input.jointAlterationJa ?? 1;
  const jointWaterReductionJw = input.jointWaterReductionJw ?? 1;
  const stressReductionFactorSrf = input.stressReductionFactorSrf ?? 1;
  if (!(rqdPercent >= 0 && rqdPercent <= 100))
    simpleError(
      "rqdPercent",
      "RQD must be between 0 and 100 percent.",
      "invalid_rqd",
    );
  if (!(jointSetNumberJn > 0))
    simpleError(
      "jointSetNumberJn",
      "Jn must be greater than zero.",
      "invalid_parameter",
    );
  if (!(jointRoughnessJr > 0))
    simpleError(
      "jointRoughnessJr",
      "Jr must be greater than zero.",
      "invalid_parameter",
    );
  if (!(jointAlterationJa > 0))
    simpleError(
      "jointAlterationJa",
      "Ja must be greater than zero.",
      "invalid_parameter",
    );
  if (!(jointWaterReductionJw > 0))
    simpleError(
      "jointWaterReductionJw",
      "Jw must be greater than zero.",
      "invalid_parameter",
    );
  if (!(stressReductionFactorSrf > 0))
    simpleError(
      "stressReductionFactorSrf",
      "SRF must be greater than zero.",
      "invalid_parameter",
    );
  return {
    qValue:
      (rqdPercent / jointSetNumberJn) *
      (jointRoughnessJr / jointAlterationJa) *
      (jointWaterReductionJw / stressReductionFactorSrf),
  };
};

export const qSystemRatingExample = {
  input: {
    rqdPercent: 80,
    jointSetNumberJn: 6,
    jointRoughnessJr: 3,
    jointAlterationJa: 1,
    jointWaterReductionJw: 1,
    stressReductionFactorSrf: 2.5,
  },
  output: { qValue: 16 },
} satisfies ToolExample<QSystemRatingInput, QSystemRatingOutput>;

export const qSystemRatingTool = createSimpleTool({
  id: "geology/q-system-rating",
  title: "Q System Rating Calculator",
  description:
    "NGI rock mass quality Q = (RQD/Jn) * (Jr/Ja) * (Jw/SRF) from the six Barton parameters supplied directly.",
  inputs: [
    {
      default: 75,
      description: "Rock Quality Designation as a percentage (0-100).",
      id: "rqdPercent",
      kind: "number",
      label: "RQD",
      unit: "%",
    },
    {
      default: 9,
      description: "Joint set number Jn from the Q tables.",
      id: "jointSetNumberJn",
      kind: "number",
      label: "Jn",
    },
    {
      default: 1,
      description: "Joint roughness number Jr from the Q tables.",
      id: "jointRoughnessJr",
      kind: "number",
      label: "Jr",
    },
    {
      default: 1,
      description: "Joint alteration number Ja from the Q tables.",
      id: "jointAlterationJa",
      kind: "number",
      label: "Ja",
    },
    {
      default: 1,
      description: "Joint water reduction factor Jw.",
      id: "jointWaterReductionJw",
      kind: "number",
      label: "Jw",
    },
    {
      default: 1,
      description: "Stress reduction factor SRF.",
      id: "stressReductionFactorSrf",
      kind: "number",
      label: "SRF",
    },
  ],
  outputs: [
    {
      description: "Q system rock mass quality value.",
      id: "qValue",
      kind: "number",
      label: "Q",
    },
  ],
  calculate: (input) =>
    calculateQSystemRating(input as unknown as QSystemRatingInput),
});

export const runQSystemRating = qSystemRatingTool.execute;
export default qSystemRatingTool;
