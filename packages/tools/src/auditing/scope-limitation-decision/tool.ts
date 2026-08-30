import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type Input = Readonly<{
  readonly evidenceUnavailable: boolean;
  readonly alternativeProceduresSuccessful: boolean;
  readonly effectMaterial: boolean;
  readonly effectPervasive: boolean;
  readonly managementImposedLimitation: boolean;
}>;
export type Output = Readonly<{
  readonly recommendedResponse: string;
  readonly severityScore: number;
}>;

export const calculate = (input: Input): Output => {
  const severityScore =
    (input.evidenceUnavailable ? 1 : 0) +
    (input.effectMaterial ? 2 : 0) +
    (input.effectPervasive ? 3 : 0) +
    (input.managementImposedLimitation ? 2 : 0) -
    (input.alternativeProceduresSuccessful ? 2 : 0);
  const recommendedResponse =
    input.managementImposedLimitation && !input.alternativeProceduresSuccessful
      ? "escalate-management-limitation"
      : input.effectMaterial &&
          input.effectPervasive &&
          !input.alternativeProceduresSuccessful
        ? "disclaimer-or-withdraw"
        : input.effectMaterial && !input.alternativeProceduresSuccessful
          ? "qualified-opinion"
          : "continue";
  return { recommendedResponse, severityScore: Math.max(0, severityScore) };
};

export const exampleInput = {
  evidenceUnavailable: true,
  alternativeProceduresSuccessful: false,
  effectMaterial: true,
  effectPervasive: false,
  managementImposedLimitation: false,
} satisfies Input;
export const exampleOutput = {
  recommendedResponse: "qualified-opinion",
  severityScore: 3,
} satisfies Output;
export const example = {
  input: exampleInput,
  output: exampleOutput,
} satisfies ToolExample<Input, Output>;

export const tool = createSimpleTool({
  calculate: (input) =>
    calculate({
      evidenceUnavailable: input.evidenceUnavailable as boolean,
      alternativeProceduresSuccessful:
        input.alternativeProceduresSuccessful as boolean,
      effectMaterial: input.effectMaterial as boolean,
      effectPervasive: input.effectPervasive as boolean,
      managementImposedLimitation: input.managementImposedLimitation as boolean,
    }),
  description:
    "Route a scope limitation from supplied evidence and effect indicators.",
  id: "auditing/scope-limitation-decision",
  inputs: [
    {
      id: "evidenceUnavailable",
      label: "Required evidence unavailable",
      kind: "boolean",
    },
    {
      id: "alternativeProceduresSuccessful",
      label: "Alternative procedures successful",
      kind: "boolean",
    },
    {
      id: "effectMaterial",
      label: "Potential effect is material",
      kind: "boolean",
    },
    {
      id: "effectPervasive",
      label: "Potential effect is pervasive",
      kind: "boolean",
    },
    {
      id: "managementImposedLimitation",
      label: "Limitation imposed by management",
      kind: "boolean",
    },
  ],
  outputs: [
    {
      id: "recommendedResponse",
      label: "Recommended response",
      kind: "string",
      enum: [
        "continue",
        "qualified-opinion",
        "disclaimer-or-withdraw",
        "escalate-management-limitation",
      ],
    },
    {
      id: "severityScore",
      label: "Limitation severity score",
      kind: "integer",
      minimum: 0,
    },
  ],
  title: "Scope-Limitation Decision",
});

export const run = tool.execute;
export default tool;
