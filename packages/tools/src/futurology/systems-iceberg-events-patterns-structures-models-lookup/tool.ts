import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

const layers = [
  {
    name: "events",
    question: "What happened, and when?",
  },
  {
    name: "patterns",
    question: "What recurring changes are visible across the events?",
  },
  {
    name: "structures",
    question: "What relationships and constraints produce those patterns?",
  },
  {
    name: "models",
    question:
      "Which mental models and assumptions make the structures visible or invisible?",
  },
] as const;

export type SystemsIcebergInput = {
  readonly modelDescription: string;
  readonly observation: string;
  readonly patternDescription: string;
  readonly structureDescription: string;
};

export type SystemsIcebergOutput = {
  readonly layerAssignments: ReadonlyArray<string>;
  readonly layerQuestions: ReadonlyArray<string>;
  readonly recommendedTrace: string;
};

export const buildSystemsIcebergMap = (
  input: SystemsIcebergInput,
): SystemsIcebergOutput => {
  for (const [field, value] of [
    ["observation", input.observation],
    ["patternDescription", input.patternDescription],
    ["structureDescription", input.structureDescription],
    ["modelDescription", input.modelDescription],
  ] as const)
    if (typeof value !== "string" || value.trim() === "")
      simpleError(
        field,
        "Every iceberg layer must have a description.",
        "iceberg_layer_required",
      );
  const descriptions = [
    input.observation.trim(),
    input.patternDescription.trim(),
    input.structureDescription.trim(),
    input.modelDescription.trim(),
  ];
  return {
    layerAssignments: layers.map(
      (layer, index) => `${layer.name}: ${descriptions[index]}`,
    ),
    layerQuestions: layers.map((layer) => `${layer.name} — ${layer.question}`),
    recommendedTrace:
      "Trace from events to patterns, then structures, then models; verify each inference with evidence rather than assuming one causes the next.",
  };
};

export const systemsIcebergExample = {
  input: {
    modelDescription: "A model that treats capacity as independent of demand",
    observation: "Waiting times rose on peak days",
    patternDescription: "Waiting times recur during demand peaks",
    structureDescription: "Capacity is scheduled independently of peak demand",
  },
  output: {
    layerAssignments: [
      "events: Waiting times rose on peak days",
      "patterns: Waiting times recur during demand peaks",
      "structures: Capacity is scheduled independently of peak demand",
      "models: A model that treats capacity as independent of demand",
    ],
    layerQuestions: [
      "events — What happened, and when?",
      "patterns — What recurring changes are visible across the events?",
      "structures — What relationships and constraints produce those patterns?",
      "models — Which mental models and assumptions make the structures visible or invisible?",
    ],
    recommendedTrace:
      "Trace from events to patterns, then structures, then models; verify each inference with evidence rather than assuming one causes the next.",
  },
} satisfies ToolExample<SystemsIcebergInput, SystemsIcebergOutput>;

export const systemsIcebergTool = createSimpleTool({
  calculate: (input) =>
    buildSystemsIcebergMap({
      modelDescription: input.modelDescription as string,
      observation: input.observation as string,
      patternDescription: input.patternDescription as string,
      structureDescription: input.structureDescription as string,
    }),
  description:
    "Organize caller-supplied events, patterns, structures, and models into an evidence-traceable systems iceberg.",
  id: "futurology/systems-iceberg-events-patterns-structures-models-lookup",
  inputs: [
    {
      id: "modelDescription",
      kind: "string",
      label: "Mental model description",
    },
    { id: "observation", kind: "string", label: "Event observation" },
    { id: "patternDescription", kind: "string", label: "Pattern description" },
    {
      id: "structureDescription",
      kind: "string",
      label: "System structure description",
    },
  ],
  outputs: [
    { id: "layerAssignments", kind: "stringList", label: "Layer assignments" },
    { id: "layerQuestions", kind: "stringList", label: "Layer questions" },
    { id: "recommendedTrace", kind: "string", label: "Recommended trace" },
  ],
  title: "Systems Iceberg Events Patterns Structures Models Lookup",
});

export const runSystemsIceberg = systemsIcebergTool.execute;
export default systemsIcebergTool;
