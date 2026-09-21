import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly stepIds: readonly string[];
  readonly markerTimes: readonly number[];
  readonly selectedStep: string;
  readonly suppliedAnchor: number;
};
export type Output = {
  readonly occurrences: number;
  readonly earliestGap: number;
  readonly latestGap: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stepIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    markerTimes: { type: "array", maxItems: 256, items: { type: "number" } },
    selectedStep: { type: "string", maxLength: 8192 },
    suppliedAnchor: { type: "number" },
  },
  required: ["stepIds", "markerTimes", "selectedStep", "suppliedAnchor"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    occurrences: { type: "integer" },
    earliestGap: { type: "number" },
    latestGap: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["occurrences", "earliestGap", "latestGap", "defined"],
} as const;
/** Calculate simulation step anchor gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stepIds, markerTimes, selectedStep, suppliedAnchor } = request;
  const compute = (): Output => {
    H.sameLength(stepIds, markerTimes);
    return (() => {
      const t = markerTimes.filter((x, i) => stepIds[i] === selectedStep);
      return {
        occurrences: t.length,
        earliestGap: t.length ? Math.min(...t) - suppliedAnchor : 0,
        latestGap: t.length ? Math.max(...t) - suppliedAnchor : 0,
        defined: t.length > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    stepIds: ["A", "B", "A"],
    markerTimes: [10, 12, 15],
    selectedStep: "A",
    suppliedAnchor: 11,
  },
  output: { occurrences: 2, earliestGap: -1, latestGap: 4, defined: true },
} satisfies ToolExample<Input, Output>;
export const simulationStepAnchorGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anesthesiology/simulation-step-anchor-gap",
    title: "Simulation Step Anchor Gap Tool",
    description:
      "Calculate simulation step anchor gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stepIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        markerTimes: {
          type: "array",
          maxItems: 256,
          items: { type: "number" },
        },
        selectedStep: { type: "string", maxLength: 8192 },
        suppliedAnchor: { type: "number" },
      },
      required: ["stepIds", "markerTimes", "selectedStep", "suppliedAnchor"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        occurrences: { type: "integer" },
        earliestGap: { type: "number" },
        latestGap: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["occurrences", "earliestGap", "latestGap", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "stepIds",
          label: "Step Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "markerTimes",
          label: "Marker Times",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "selectedStep",
          label: "Selected Step",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "suppliedAnchor",
          label: "Supplied Anchor",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "occurrences",
          label: "Occurrences",
          valueType: { type: "integer" },
        },
        {
          id: "earliestGap",
          label: "Earliest Gap",
          valueType: { type: "number" },
        },
        { id: "latestGap", label: "Latest Gap", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = simulationStepAnchorGapTool.execute;
export default simulationStepAnchorGapTool;
