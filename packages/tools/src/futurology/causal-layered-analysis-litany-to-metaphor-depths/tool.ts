import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CausalLayeredAnalysisInput = {
  readonly litany: string;
  readonly mythOrMetaphor: string;
  readonly socialSystemCauses: string;
  readonly worldviewOrDiscourse: string;
};

export type CausalLayeredAnalysisOutput = {
  readonly layerSequence: ReadonlyArray<string>;
  readonly mappedLayerCount: number;
};

export const mapCausalLayeredAnalysis = (
  input: CausalLayeredAnalysisInput,
): CausalLayeredAnalysisOutput => {
  const layers: ReadonlyArray<
    readonly [keyof CausalLayeredAnalysisInput, string, string]
  > = [
    ["litany", "Litany", input.litany],
    ["socialSystemCauses", "Social or system causes", input.socialSystemCauses],
    [
      "worldviewOrDiscourse",
      "Worldview or discourse",
      input.worldviewOrDiscourse,
    ],
    ["mythOrMetaphor", "Myth or metaphor", input.mythOrMetaphor],
  ];
  for (const [field, , value] of layers)
    if (typeof value !== "string" || value.trim() === "")
      simpleError(
        field,
        "Each causal-layered-analysis layer must be a nonempty string.",
        "invalid_layer_content",
      );
  return {
    layerSequence: layers.map(
      ([, label, value]) => `${label}: ${value.trim()}`,
    ),
    mappedLayerCount: layers.length,
  };
};

export const causalLayeredAnalysisExample = {
  input: {
    litany: "Commute times are increasing",
    mythOrMetaphor: "The city as a clogged artery",
    socialSystemCauses: "Housing and jobs are spatially separated",
    worldviewOrDiscourse: "Mobility is equated with private car ownership",
  },
  output: {
    layerSequence: [
      "Litany: Commute times are increasing",
      "Social or system causes: Housing and jobs are spatially separated",
      "Worldview or discourse: Mobility is equated with private car ownership",
      "Myth or metaphor: The city as a clogged artery",
    ],
    mappedLayerCount: 4,
  },
} satisfies ToolExample<
  CausalLayeredAnalysisInput,
  CausalLayeredAnalysisOutput
>;

export const causalLayeredAnalysisTool = createSimpleTool({
  calculate: (input) =>
    mapCausalLayeredAnalysis({
      litany: input.litany as string,
      mythOrMetaphor: input.mythOrMetaphor as string,
      socialSystemCauses: input.socialSystemCauses as string,
      worldviewOrDiscourse: input.worldviewOrDiscourse as string,
    }),
  description:
    "Arrange a futures issue across the four causal layered analysis depths: litany, social or system causes, worldview or discourse, and myth or metaphor.",
  id: "futurology/causal-layered-analysis-litany-to-metaphor-depths",
  inputs: [
    { id: "litany", kind: "string", label: "Litany" },
    {
      id: "socialSystemCauses",
      kind: "string",
      label: "Social or system causes",
    },
    {
      id: "worldviewOrDiscourse",
      kind: "string",
      label: "Worldview or discourse",
    },
    { id: "mythOrMetaphor", kind: "string", label: "Myth or metaphor" },
  ],
  outputs: [
    { id: "layerSequence", kind: "stringList", label: "Layer sequence" },
    {
      id: "mappedLayerCount",
      kind: "integer",
      label: "Mapped layers",
      maximum: 4,
      minimum: 4,
    },
  ],
  title: "Causal Layered Analysis Litany to Metaphor Depths",
});

export const runCausalLayeredAnalysis = causalLayeredAnalysisTool.execute;
export default causalLayeredAnalysisTool;
