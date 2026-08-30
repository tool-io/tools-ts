import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DiegeticArtifactInput = {
  readonly constraint: string;
  readonly futureContext: string;
  readonly material: string;
  readonly userNeed: string;
};

export type DiegeticArtifactOutput = {
  readonly artifactDescription: string;
  readonly artifactName: string;
  readonly designPrinciple: string;
  readonly interactionStory: string;
};

export const buildDiegeticFutureArtifact = (
  input: DiegeticArtifactInput,
): DiegeticArtifactOutput => {
  for (const [field, value] of [
    ["futureContext", input.futureContext],
    ["userNeed", input.userNeed],
    ["material", input.material],
    ["constraint", input.constraint],
  ] as const)
    if (typeof value !== "string" || value.trim() === "")
      simpleError(
        field,
        "Artifact fields must be nonempty strings.",
        "artifact_field_required",
      );
  const futureContext = input.futureContext.trim();
  const userNeed = input.userNeed.trim();
  const material = input.material.trim();
  const constraint = input.constraint.trim();
  const artifactName = `${userNeed} ${material} artifact`;
  return {
    artifactDescription: `A ${material} artifact from ${futureContext}, designed around ${userNeed} and constrained by ${constraint}.`,
    artifactName,
    designPrinciple: `Make ${constraint} visible through the object's form, limitations, and use rather than explanatory text.`,
    interactionStory: `A user encounters the ${artifactName}, uses it to address ${userNeed}, and notices where ${constraint} changes the available action.`,
  };
};

export const diegeticArtifactExample = {
  input: {
    constraint: "local energy is intermittent",
    futureContext: "a neighborhood microgrid",
    material: "ceramic",
    userNeed: "share surplus power",
  },
  output: {
    artifactDescription:
      "A ceramic artifact from a neighborhood microgrid, designed around share surplus power and constrained by local energy is intermittent.",
    artifactName: "share surplus power ceramic artifact",
    designPrinciple:
      "Make local energy is intermittent visible through the object's form, limitations, and use rather than explanatory text.",
    interactionStory:
      "A user encounters the share surplus power ceramic artifact, uses it to address share surplus power, and notices where local energy is intermittent changes the available action.",
  },
} satisfies ToolExample<DiegeticArtifactInput, DiegeticArtifactOutput>;

export const diegeticArtifactTool = createSimpleTool({
  calculate: (input) =>
    buildDiegeticFutureArtifact({
      constraint: input.constraint as string,
      futureContext: input.futureContext as string,
      material: input.material as string,
      userNeed: input.userNeed as string,
    }),
  description:
    "Build a diegetic design-fiction artifact description, interaction story, and design principle from caller-supplied future context and constraints.",
  id: "futurology/design-fiction-diegetic-artifact-from-future-builder",
  inputs: [
    { id: "constraint", kind: "string", label: "Design constraint" },
    { id: "futureContext", kind: "string", label: "Future context" },
    { id: "material", kind: "string", label: "Artifact material" },
    { id: "userNeed", kind: "string", label: "User need" },
  ],
  outputs: [
    {
      id: "artifactDescription",
      kind: "string",
      label: "Artifact description",
    },
    { id: "artifactName", kind: "string", label: "Artifact name" },
    { id: "designPrinciple", kind: "string", label: "Design principle" },
    { id: "interactionStory", kind: "string", label: "Interaction story" },
  ],
  title: "Design Fiction Diegetic Artifact From Future Builder",
});

export const runDiegeticArtifact = diegeticArtifactTool.execute;
export default diegeticArtifactTool;
