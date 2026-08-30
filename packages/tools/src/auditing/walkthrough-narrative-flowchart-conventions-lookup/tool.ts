import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type WalkthroughConventionInput = {
  readonly controlActivities: boolean;
  readonly exceptionHandling: boolean;
  readonly inputs: boolean;
  readonly outputs: boolean;
  readonly processOwner: boolean;
  readonly purpose: boolean;
};

export type WalkthroughConventionOutput = {
  readonly complete: boolean;
  readonly completedCount: number;
  readonly conventionCount: number;
  readonly missingConventions: ReadonlyArray<string>;
};

export const checkWalkthroughConventions = (
  input: WalkthroughConventionInput,
): WalkthroughConventionOutput => {
  const conventions: readonly (readonly [string, boolean])[] = [
    ["process owner", input.processOwner],
    ["purpose", input.purpose],
    ["inputs", input.inputs],
    ["outputs", input.outputs],
    ["control activities", input.controlActivities],
    ["exception handling", input.exceptionHandling],
  ];
  for (const [name, present] of conventions)
    if (typeof present !== "boolean")
      simpleError(
        name.replaceAll(" ", ""),
        `${name} must be a boolean.`,
        "boolean_field_required",
      );
  const missingConventions = conventions
    .filter(([, present]) => !present)
    .map(([name]) => name);
  return {
    complete: missingConventions.length === 0,
    completedCount: conventions.length - missingConventions.length,
    conventionCount: conventions.length,
    missingConventions,
  };
};

export const walkthroughConventionExample = {
  input: {
    controlActivities: true,
    exceptionHandling: false,
    inputs: true,
    outputs: true,
    processOwner: true,
    purpose: true,
  },
  output: {
    complete: false,
    completedCount: 5,
    conventionCount: 6,
    missingConventions: ["exception handling"],
  },
} satisfies ToolExample<
  WalkthroughConventionInput,
  WalkthroughConventionOutput
>;

export const walkthroughConventionTool = createSimpleTool({
  calculate: (input) =>
    checkWalkthroughConventions({
      controlActivities: input.controlActivities as boolean,
      exceptionHandling: input.exceptionHandling as boolean,
      inputs: input.inputs as boolean,
      outputs: input.outputs as boolean,
      processOwner: input.processOwner as boolean,
      purpose: input.purpose as boolean,
    }),
  description:
    "Check a walkthrough record for six caller-defined narrative conventions and report the missing elements without supplying engagement-specific facts.",
  id: "auditing/walkthrough-narrative-flowchart-conventions-lookup",
  inputs: [
    {
      id: "controlActivities",
      kind: "boolean",
      label: "Control activities documented",
    },
    {
      id: "exceptionHandling",
      kind: "boolean",
      label: "Exception handling documented",
    },
    { id: "inputs", kind: "boolean", label: "Inputs documented" },
    { id: "outputs", kind: "boolean", label: "Outputs documented" },
    { id: "processOwner", kind: "boolean", label: "Process owner documented" },
    { id: "purpose", kind: "boolean", label: "Process purpose documented" },
  ],
  outputs: [
    { id: "complete", kind: "boolean", label: "Conventions complete" },
    {
      id: "completedCount",
      kind: "integer",
      label: "Conventions present",
      minimum: 0,
    },
    {
      id: "conventionCount",
      kind: "integer",
      label: "Conventions checked",
      minimum: 6,
    },
    {
      id: "missingConventions",
      kind: "stringList",
      label: "Missing conventions",
    },
  ],
  title: "Walkthrough Narrative Flowchart Conventions Lookup",
});

export const runWalkthroughConventions = walkthroughConventionTool.execute;
export default walkthroughConventionTool;
