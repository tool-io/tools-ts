import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const formats = {
  cause: {
    prompts: [
      "What causal chain would make this risk materially worse?",
      "What observation would distinguish this pathway from a benign explanation?",
    ],
    purpose: "Clarify mechanisms and intervention points.",
  },
  magnitude: {
    prompts: [
      "What population and outcome are affected at low, central, and severe levels?",
      "What recovery timescale follows each severity level?",
    ],
    purpose: "Expose hidden differences across severity bands.",
  },
  probability: {
    prompts: [
      "Which evidence would raise or lower the plausibility assessment?",
      "What observation could falsify the current probability range?",
    ],
    purpose: "Surface probability assumptions and update evidence.",
  },
  response: {
    prompts: [
      "Who can act before, during, and after the risk materializes?",
      "What irreversible decisions would be difficult to reverse?",
    ],
    purpose: "Make response options and authority visible.",
  },
} as const;
const orderedFormats = [
  formats.cause,
  formats.probability,
  formats.magnitude,
  formats.response,
] as const;

export type ExistentialRiskFormat = keyof typeof formats;

export type PDoomElicitationInput = {
  readonly riskPathway: string;
  readonly riskTimeHorizon: string;
};

export type PDoomElicitationOutput = {
  readonly elicitationPrompts: ReadonlyArray<string>;
  readonly formatPurpose: string;
  readonly riskPathway: string;
  readonly riskTimeHorizon: string;
};

export const buildPDoomElicitationFormat = (
  input: PDoomElicitationInput,
): PDoomElicitationOutput => {
  for (const [field, value] of [
    ["riskPathway", input.riskPathway],
    ["riskTimeHorizon", input.riskTimeHorizon],
  ] as const)
    if (typeof value !== "string" || value.trim() === "")
      simpleError(
        field,
        "Risk pathway and time horizon must be nonempty strings.",
        "risk_description_required",
      );
  const combinedPrompts = orderedFormats.flatMap((format) => format.prompts);
  return {
    elicitationPrompts: combinedPrompts,
    formatPurpose:
      "Cover cause, probability, magnitude, and response in a structured existential-risk elicitation.",
    riskPathway: input.riskPathway.trim(),
    riskTimeHorizon: input.riskTimeHorizon.trim(),
  };
};

export const pDoomElicitationExample = {
  input: {
    riskPathway: "An unrecoverable loss of human control",
    riskTimeHorizon: "Any horizon",
  },
  output: {
    elicitationPrompts: [
      "What causal chain would make this risk materially worse?",
      "What observation would distinguish this pathway from a benign explanation?",
      "Which evidence would raise or lower the plausibility assessment?",
      "What observation could falsify the current probability range?",
      "What population and outcome are affected at low, central, and severe levels?",
      "What recovery timescale follows each severity level?",
      "Who can act before, during, and after the risk materializes?",
      "What irreversible decisions would be difficult to reverse?",
    ],
    formatPurpose:
      "Cover cause, probability, magnitude, and response in a structured existential-risk elicitation.",
    riskPathway: "An unrecoverable loss of human control",
    riskTimeHorizon: "Any horizon",
  },
} satisfies ToolExample<PDoomElicitationInput, PDoomElicitationOutput>;

export const pDoomElicitationTool = createSimpleTool({
  calculate: (input) =>
    buildPDoomElicitationFormat({
      riskPathway: input.riskPathway as string,
      riskTimeHorizon: input.riskTimeHorizon as string,
    }),
  description:
    "Return a structured existential-risk elicitation format covering cause, probability, magnitude, and response.",
  id: "futurology/p-doom-existential-risk-elicitation-format-lookup",
  inputs: [
    { id: "riskPathway", kind: "string", label: "Risk pathway" },
    { id: "riskTimeHorizon", kind: "string", label: "Risk time horizon" },
  ],
  outputs: [
    {
      id: "elicitationPrompts",
      kind: "stringList",
      label: "Elicitation prompts",
    },
    { id: "formatPurpose", kind: "string", label: "Format purpose" },
    { id: "riskPathway", kind: "string", label: "Risk pathway" },
    { id: "riskTimeHorizon", kind: "string", label: "Risk time horizon" },
  ],
  title: "P Doom Existential Risk Elicitation Format Lookup",
});

export const runPDoomElicitation = pDoomElicitationTool.execute;
export default pDoomElicitationTool;
