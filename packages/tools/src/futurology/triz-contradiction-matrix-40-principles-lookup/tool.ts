import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const principles = [
  "Segmentation",
  "Extraction",
  "Local quality",
  "Asymmetry",
  "Merging",
  "Universality",
  "Quantity",
  "Partiality",
  "Ineffectiveness",
  "Preliminary action",
  "Holography",
  "Inertia",
  "The other way round",
  "Feedback",
  "Dynamization",
  "Copying",
  "Analogy",
  "Oscillation",
  "Periodicity",
  "Continuity",
  "Adaptation",
  "Inversion",
  "Negation",
  "Envelopment",
  "Intermediary",
  "Self-service",
  "Self-elimination",
  "Substitution",
  "Integration",
  "Stretching",
  "Expansion",
  "Conversion",
  "Homogeneity",
  "Locality",
  "Unfolding",
  "Removing weakness",
  "Repetition",
  "Separation",
  "Contrasting",
  "Strengthening",
] as const;

const guidance: Readonly<Record<(typeof principles)[number], string>> = {
  Segmentation: "Divide a whole into independently controllable parts.",
  Extraction:
    "Remove a necessary part from a system and operate it separately.",
  "Local quality":
    "Make one part highly optimized rather than optimizing everything equally.",
  Asymmetry:
    "Develop different properties for different functions or contexts.",
  Merging: "Combine functions or objects into a larger integrated whole.",
  Universality: "Make an object perform several additional functions.",
  Quantity:
    "Change a quantitative property such as degree, scale, or concentration.",
  Partiality: "Introduce a limited, deliberately incomplete subsystem.",
  Ineffectiveness:
    "Remove a harmful or ineffective component without replacing it initially.",
  "Preliminary action":
    "Introduce an action that is easier to reverse or remove later.",
  Holography:
    "Use a lower-complexity model that preserves required information.",
  Inertia: "Delay a change so existing conditions can adapt before commitment.",
  "The other way round": "Invert the system or remove the harmful element.",
  Feedback: "Introduce or strengthen feedback about the result.",
  Dynamization: "Change a fixed property into a continuously adjustable one.",
  Copying: "Use an existing, proven solution rather than inventing anew.",
  Analogy: "Transfer a working solution from another system.",
  Oscillation:
    "Alternate a parameter or action between states to find or control behavior.",
  Periodicity: "Introduce a repeating cycle or schedule.",
  Continuity: "Remove abrupt transitions and connect adjacent stages.",
  Adaptation: "Change a component to fit new operating conditions.",
  Inversion: "Reverse the system's process, function, or location.",
  Negation: "Remove a harmful element or perform the complementary action.",
  Envelopment:
    "Place a system inside a larger system that supplies or absorbs effects.",
  Intermediary:
    "Insert an intermediate element to carry or translate an action.",
  "Self-service": "Make the system supply part of its own required function.",
  "Self-elimination":
    "Arrange for a component or process to remove or replace itself.",
  Substitution: "Replace a weak or harmful element with a better one.",
  Integration: "Combine previously separate parts.",
  Stretching: "Extend a capability or dimension beyond its prior limit.",
  Expansion: "Increase the degree or scale of an existing function.",
  Conversion: "Change one property, function, or substance into another.",
  Homogeneity: "Reduce variety by making parts or steps alike.",
  Locality: "Move an action or resource to a favorable local place.",
  Unfolding:
    "Expose or separate a hidden part of a system for inspection or control.",
  "Removing weakness": "Remove a weak part before a complete redesign.",
  Repetition: "Repeat an action or component to achieve a cumulative effect.",
  Separation: "Separate a coupled part in space, time, or function.",
  Contrasting:
    "Bring contrasting properties or states into productive relation.",
  Strengthening: "Increase the magnitude or degree of an existing property.",
};

export type TrizPrincipleInput = {
  readonly principleNumber: number;
};

export type TrizPrincipleOutput = {
  readonly applicationGuidance: string;
  readonly principleName: (typeof principles)[number];
  readonly principleNumber: number;
};

export const lookupTrizInventivePrinciple = (
  input: TrizPrincipleInput,
): TrizPrincipleOutput => {
  if (
    !Number.isSafeInteger(input.principleNumber) ||
    input.principleNumber < 1 ||
    input.principleNumber > principles.length
  )
    simpleError(
      "principleNumber",
      "Principle number must be an integer from 1 through 40.",
      "principle_number_out_of_range",
    );
  const principleName = principles[input.principleNumber - 1]!;
  return {
    applicationGuidance: guidance[principleName],
    principleName,
    principleNumber: input.principleNumber,
  };
};

export const trizPrincipleExample = {
  input: { principleNumber: 1 },
  output: {
    applicationGuidance:
      "Divide a whole into independently controllable parts.",
    principleName: "Segmentation",
    principleNumber: 1,
  },
} satisfies ToolExample<TrizPrincipleInput, TrizPrincipleOutput>;

export const trizPrincipleTool = createSimpleTool({
  calculate: (input) =>
    lookupTrizInventivePrinciple({
      principleNumber: input.principleNumber as number,
    }),
  description:
    "Look up one of the 40 TRIZ inventive principles and return concise contradiction-resolution guidance.",
  id: "futurology/triz-contradiction-matrix-40-principles-lookup",
  inputs: [
    {
      id: "principleNumber",
      kind: "integer",
      label: "Principle number",
      maximum: 40,
      minimum: 1,
    },
  ],
  outputs: [
    {
      id: "applicationGuidance",
      kind: "string",
      label: "Application guidance",
    },
    { id: "principleName", kind: "string", label: "Principle name" },
    {
      id: "principleNumber",
      kind: "integer",
      label: "Principle number",
      maximum: 40,
      minimum: 1,
    },
  ],
  title: "TRIZ Contradiction Matrix 40 Principles Lookup",
});

export const runTrizPrinciple = trizPrincipleTool.execute;
export default trizPrincipleTool;
