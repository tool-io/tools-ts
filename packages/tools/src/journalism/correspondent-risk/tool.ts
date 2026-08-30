import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly activeHostilities: boolean;
  readonly detentionRisk: boolean;
  readonly limitedMedicalAccess: boolean;
  readonly communicationsBlackout: boolean;
  readonly localSupportAvailable: boolean;
}>;
export type Output = Readonly<{
  readonly riskScore: number;
  readonly riskLevel: string;
  readonly triggeredRisks: readonly string[];
}>;

export const calculate = (input: Input): Output => {
  const risks = [
    ["activeHostilities", input.activeHostilities, 3],
    ["detentionRisk", input.detentionRisk, 3],
    ["limitedMedicalAccess", input.limitedMedicalAccess, 2],
    ["communicationsBlackout", input.communicationsBlackout, 2],
  ] as const;
  const triggeredRisks = risks.filter(([, on]) => on).map(([id]) => id);
  const riskScore = Math.max(
    0,
    risks.reduce((sum, [, on, weight]) => sum + (on ? weight : 0), 0) -
      (input.localSupportAvailable ? 2 : 0),
  );
  return {
    riskScore,
    riskLevel: riskScore >= 6 ? "high" : riskScore >= 3 ? "elevated" : "low",
    triggeredRisks,
  };
};

export const exampleInput = {
  activeHostilities: true,
  detentionRisk: false,
  limitedMedicalAccess: true,
  communicationsBlackout: false,
  localSupportAvailable: false,
} satisfies Input;
export const exampleOutput = {
  riskScore: 5,
  riskLevel: "elevated",
  triggeredRisks: ["activeHostilities", "limitedMedicalAccess"],
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      activeHostilities: input.activeHostilities as boolean,
      detentionRisk: input.detentionRisk as boolean,
      limitedMedicalAccess: input.limitedMedicalAccess as boolean,
      communicationsBlackout: input.communicationsBlackout as boolean,
      localSupportAvailable: input.localSupportAvailable as boolean,
    }),
  description:
    "Score correspondent deployment risk from supplied operational indicators.",
  id: "journalism/correspondent-risk",
  inputs: [
    { id: "activeHostilities", label: "Active hostilities", kind: "boolean" },
    { id: "detentionRisk", label: "Detention risk", kind: "boolean" },
    {
      id: "limitedMedicalAccess",
      label: "Limited medical access",
      kind: "boolean",
    },
    {
      id: "communicationsBlackout",
      label: "Communications blackout",
      kind: "boolean",
    },
    {
      id: "localSupportAvailable",
      label: "Local support available",
      kind: "boolean",
    },
  ],
  outputs: [
    { id: "riskScore", label: "Risk score", kind: "integer", minimum: 0 },
    {
      id: "riskLevel",
      label: "Risk level",
      kind: "string",
      enum: ["low", "elevated", "high"],
    },
    {
      id: "triggeredRisks",
      label: "Triggered risk indicators",
      kind: "stringList",
    },
  ],
  title: "Correspondent Risk",
});

export const run = tool.execute;
export default tool;
