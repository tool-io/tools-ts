import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const pathDefinitions = {
  artificialIntelligence: {
    definition:
      "Create machine intelligence through software, including neuromorphic or synthetic approaches.",
    limitation:
      "The route depends on solving general intelligence in an engineered system.",
  },
  biologicalCognition: {
    definition:
      "Increase biological cognitive ability through selection, enhancement, or other biological interventions.",
    limitation:
      "Biological development and generational constraints can limit speed and scale.",
  },
  brainComputerInterfaces: {
    definition:
      "Combine human cognition with computer systems through direct interfaces.",
    limitation:
      "Interface bandwidth and the need to understand useful neural representations constrain the route.",
  },
  networksAndOrganizations: {
    definition:
      "Improve collective intelligence through communication networks and organizational coordination.",
    limitation:
      "Coordination gains may improve collective problem solving without producing a single generally superintelligent agent.",
  },
  wholeBrainEmulation: {
    definition:
      "Scan and computationally reproduce the functional structure of a biological brain.",
    limitation:
      "The route requires sufficiently detailed scanning, reconstruction, and simulation of neural computation.",
  },
} as const;

export type SuperintelligencePath = keyof typeof pathDefinitions;

export type BostromPathwaysInput = {
  readonly pathway: SuperintelligencePath;
};

export type BostromPathwaysOutput = {
  readonly keyLimitation: string;
  readonly pathway: SuperintelligencePath;
  readonly pathwayDefinition: string;
};

export const lookupBostromSuperintelligencePathway = (
  input: BostromPathwaysInput,
): BostromPathwaysOutput => {
  const definition = pathDefinitions[input.pathway];
  if (definition === undefined)
    simpleError(
      "pathway",
      "Pathway is not supported.",
      "unsupported_superintelligence_pathway",
    );
  return {
    keyLimitation: definition.limitation,
    pathway: input.pathway,
    pathwayDefinition: definition.definition,
  };
};

export const bostromPathwaysExample = {
  input: { pathway: "wholeBrainEmulation" },
  output: {
    keyLimitation:
      "The route requires sufficiently detailed scanning, reconstruction, and simulation of neural computation.",
    pathway: "wholeBrainEmulation",
    pathwayDefinition:
      "Scan and computationally reproduce the functional structure of a biological brain.",
  },
} satisfies ToolExample<BostromPathwaysInput, BostromPathwaysOutput>;

export const bostromPathwaysTool = createSimpleTool({
  calculate: (input) =>
    lookupBostromSuperintelligencePathway({
      pathway: input.pathway as SuperintelligencePath,
    }),
  description:
    "Look up one of the five technological paths to superintelligence discussed by Nick Bostrom and a central limitation of that path.",
  id: "futurology/bostrom-superintelligence-paths-taxonomy-lookup",
  inputs: [
    {
      enum: [
        "artificialIntelligence",
        "wholeBrainEmulation",
        "biologicalCognition",
        "brainComputerInterfaces",
        "networksAndOrganizations",
      ],
      id: "pathway",
      kind: "string",
      label: "Superintelligence pathway",
    },
  ],
  outputs: [
    { id: "keyLimitation", kind: "string", label: "Key limitation" },
    { id: "pathway", kind: "string", label: "Superintelligence pathway" },
    { id: "pathwayDefinition", kind: "string", label: "Pathway definition" },
  ],
  title: "Bostrom Paths to Superintelligence Lookup",
});

export const runBostromPathways = bostromPathwaysTool.execute;
export default bostromPathwaysTool;
