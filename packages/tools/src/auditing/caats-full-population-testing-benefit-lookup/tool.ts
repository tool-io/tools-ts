import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type CaatsFullPopulationInput = {
  readonly auditorReviewed: boolean;
  readonly exceptionsResolved: boolean;
  readonly populationComplete: boolean;
  readonly queryParametersComplete: boolean;
  readonly resultsReconciled: boolean;
};

export type CaatsFullPopulationOutput = {
  readonly complete: boolean;
  readonly completedCount: number;
  readonly missingControls: ReadonlyArray<string>;
  readonly populationTestingReady: boolean;
};

export const checkCaatsFullPopulationReadiness = (
  input: CaatsFullPopulationInput,
): CaatsFullPopulationOutput => {
  const controls: readonly (readonly [string, boolean])[] = [
    ["complete population", input.populationComplete],
    ["complete query parameters", input.queryParametersComplete],
    ["reconciled results", input.resultsReconciled],
    ["resolved exceptions", input.exceptionsResolved],
    ["auditor review", input.auditorReviewed],
  ];
  for (const [control, complete] of controls)
    if (typeof complete !== "boolean")
      simpleError(
        control.replaceAll(" ", ""),
        `${control} must be a boolean.`,
        "boolean_field_required",
      );
  const missingControls = controls
    .filter(([, complete]) => !complete)
    .map(([control]) => control);
  return {
    complete: missingControls.length === 0,
    completedCount: controls.length - missingControls.length,
    missingControls,
    populationTestingReady: missingControls.length === 0,
  };
};

export const caatsFullPopulationExample = {
  input: {
    auditorReviewed: true,
    exceptionsResolved: false,
    populationComplete: true,
    queryParametersComplete: true,
    resultsReconciled: true,
  },
  output: {
    complete: false,
    completedCount: 4,
    missingControls: ["resolved exceptions"],
    populationTestingReady: false,
  },
} satisfies ToolExample<CaatsFullPopulationInput, CaatsFullPopulationOutput>;

export const caatsFullPopulationTool = createSimpleTool({
  calculate: (input) =>
    checkCaatsFullPopulationReadiness({
      auditorReviewed: input.auditorReviewed as boolean,
      exceptionsResolved: input.exceptionsResolved as boolean,
      populationComplete: input.populationComplete as boolean,
      queryParametersComplete: input.queryParametersComplete as boolean,
      resultsReconciled: input.resultsReconciled as boolean,
    }),
  description:
    "Check supplied computer-assisted full-population testing controls for complete data, query parameters, reconciliation, exception resolution, and auditor review.",
  id: "auditing/caats-full-population-testing-benefit-lookup",
  inputs: [
    {
      id: "auditorReviewed",
      kind: "boolean",
      label: "Auditor review complete",
    },
    { id: "exceptionsResolved", kind: "boolean", label: "Exceptions resolved" },
    { id: "populationComplete", kind: "boolean", label: "Population complete" },
    {
      id: "queryParametersComplete",
      kind: "boolean",
      label: "Query parameters complete",
    },
    { id: "resultsReconciled", kind: "boolean", label: "Results reconciled" },
  ],
  outputs: [
    { id: "complete", kind: "boolean", label: "Testing controls complete" },
    {
      id: "completedCount",
      kind: "integer",
      label: "Controls complete",
      minimum: 0,
    },
    { id: "missingControls", kind: "stringList", label: "Missing controls" },
    {
      id: "populationTestingReady",
      kind: "boolean",
      label: "Population testing ready",
    },
  ],
  title: "CAATS Full Population Testing Benefit Lookup",
});

export const runCaatsFullPopulation = caatsFullPopulationTool.execute;
export default caatsFullPopulationTool;
