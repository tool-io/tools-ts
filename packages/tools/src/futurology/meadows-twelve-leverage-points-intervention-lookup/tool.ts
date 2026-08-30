import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const leveragePoints = {
  goals: {
    intervention: "Revise the purpose and success measures of the system.",
    limitation: "Deep goals and power remain difficult to change.",
    position: 9,
  },
  informationFlows: {
    intervention: "Change what information is visible, timely, or actionable.",
    limitation: "High influence depends on context and access.",
    position: 6,
  },
  rules: {
    intervention:
      "Change incentives, constraints, permissions, and enforcement.",
    limitation: "Rules may be resisted or produce unintended workarounds.",
    position: 8,
  },
  systemParameters: {
    intervention:
      "Change quantities or constraints such as size, rates, or capacity.",
    limitation:
      "Usually easier to act on but lower leverage than goals and rules.",
    position: 1,
  },
  feedbackStrength: {
    intervention: "Strengthen reliable feedback about system outcomes.",
    limitation: "Delay and attribution can weaken learning.",
    position: 4,
  },
  delays: {
    intervention: "Reduce harmful response delays and synchronize action.",
    limitation: "Some delays are structural or safety-critical.",
    position: 3,
  },
  flows: {
    intervention: "Change material, information, or financial flows.",
    limitation:
      "Flow interventions may be blocked by infrastructure and power.",
    position: 2,
  },
  structure: {
    intervention:
      "Change connectivity, incentives, or authority relationships.",
    limitation: "Structural change is contested and path dependent.",
    position: 7,
  },
  buffers: {
    intervention: "Increase or reduce reserves and resilience capacity.",
    limitation: "Buffers postpone rather than remove underlying pressure.",
    position: 5,
  },
  selfOrganization: {
    intervention:
      "Enable adaptive, decentralized, or self-organizing response.",
    limitation: "Coordination and accountability can become unclear.",
    position: 10,
  },
  strategy: {
    intervention:
      "Change the strategic approach and sequence of interventions.",
    limitation: "Strategy remains bounded by goals, information, and rules.",
    position: 11,
  },
  paradigm: {
    intervention: "Shift the underlying worldview and system paradigm.",
    limitation: "Very difficult to observe, test, or coordinate.",
    position: 12,
  },
} as const;

export type MeadowsLeveragePoint = keyof typeof leveragePoints;

export type MeadowsLeverageInput = {
  readonly leveragePoint: MeadowsLeveragePoint;
};

export type MeadowsLeverageOutput = {
  readonly intervention: string;
  readonly leveragePosition: number;
  readonly leveragePoint: MeadowsLeveragePoint;
  readonly limitation: string;
};

export const lookupMeadowsLeveragePoint = (
  input: MeadowsLeverageInput,
): MeadowsLeverageOutput => {
  const leveragePoint = leveragePoints[input.leveragePoint];
  if (leveragePoint === undefined)
    simpleError(
      "leveragePoint",
      "Leverage point is not supported.",
      "unsupported_leverage_point",
    );
  return {
    intervention: leveragePoint.intervention,
    leveragePosition: leveragePoint.position,
    leveragePoint: input.leveragePoint,
    limitation: leveragePoint.limitation,
  };
};

export const meadowsLeverageExample = {
  input: { leveragePoint: "goals" },
  output: {
    intervention: "Revise the purpose and success measures of the system.",
    leveragePosition: 9,
    leveragePoint: "goals",
    limitation: "Deep goals and power remain difficult to change.",
  },
} satisfies ToolExample<MeadowsLeverageInput, MeadowsLeverageOutput>;

export const meadowsLeverageTool = createSimpleTool({
  calculate: (input) =>
    lookupMeadowsLeveragePoint({
      leveragePoint: input.leveragePoint as MeadowsLeveragePoint,
    }),
  description:
    "Return the intervention, limitation, and leverage position for a caller-selected system leverage point.",
  id: "futurology/meadows-twelve-leverage-points-intervention-lookup",
  inputs: [
    {
      enum: [
        "systemParameters",
        "flows",
        "delays",
        "buffers",
        "feedbackStrength",
        "informationFlows",
        "structure",
        "rules",
        "goals",
        "selfOrganization",
        "strategy",
        "paradigm",
      ],
      id: "leveragePoint",
      kind: "string",
      label: "System leverage point",
    },
  ],
  outputs: [
    { id: "intervention", kind: "string", label: "Intervention" },
    {
      id: "leveragePosition",
      kind: "integer",
      label: "Leverage position",
      maximum: 12,
      minimum: 1,
    },
    { id: "leveragePoint", kind: "string", label: "System leverage point" },
    { id: "limitation", kind: "string", label: "Intervention limitation" },
  ],
  title: "Meadows Twelve Leverage Points Intervention Lookup",
});

export const runMeadowsLeverage = meadowsLeverageTool.execute;
export default meadowsLeverageTool;
