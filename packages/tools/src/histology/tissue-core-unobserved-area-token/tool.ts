import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly coreArea: number;
  readonly unobservedArea: number;
  readonly excludedArea: number;
  readonly sharedArea: number;
};
export type Output = {
  readonly observableArea: number;
  readonly observableFraction: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coreArea: { type: "number", exclusiveMinimum: 0 },
    unobservedArea: { type: "number", minimum: 0 },
    excludedArea: { type: "number", minimum: 0 },
    sharedArea: { type: "number", minimum: 0 },
  },
  required: ["coreArea", "unobservedArea", "excludedArea", "sharedArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observableArea: { type: "number" },
    observableFraction: { type: "number" },
  },
  required: ["observableArea", "observableFraction"],
} as const;
/** Calculate tissue core unobserved area token from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { coreArea, unobservedArea, excludedArea, sharedArea } = request;
  const compute = (): Output => {
    H.positive(coreArea);
    H.domain(
      unobservedArea >= 0 &&
        excludedArea >= 0 &&
        sharedArea >= 0 &&
        sharedArea <= Math.min(unobservedArea, excludedArea) &&
        unobservedArea + excludedArea - sharedArea <= coreArea,
    );
    return {
      observableArea: coreArea - unobservedArea - excludedArea + sharedArea,
      observableFraction:
        (coreArea - unobservedArea - excludedArea + sharedArea) / coreArea,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { coreArea: 100, unobservedArea: 20, excludedArea: 10, sharedArea: 5 },
  output: { observableArea: 75, observableFraction: 0.75 },
} satisfies ToolExample<Input, Output>;
export const tissueCoreUnobservedAreaTokenTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "histology/tissue-core-unobserved-area-token",
    title: "Tissue Core Unobserved Area Token Tool",
    description:
      "Calculate tissue core unobserved area token from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coreArea: { type: "number", exclusiveMinimum: 0 },
        unobservedArea: { type: "number", minimum: 0 },
        excludedArea: { type: "number", minimum: 0 },
        sharedArea: { type: "number", minimum: 0 },
      },
      required: ["coreArea", "unobservedArea", "excludedArea", "sharedArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observableArea: { type: "number" },
        observableFraction: { type: "number" },
      },
      required: ["observableArea", "observableFraction"],
    },
    ports: {
      inputs: [
        {
          id: "coreArea",
          label: "Core Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "unobservedArea",
          label: "Unobserved Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedArea",
          label: "Excluded Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sharedArea",
          label: "Shared Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "observableArea",
          label: "Observable Area",
          valueType: { type: "number" },
        },
        {
          id: "observableFraction",
          label: "Observable Fraction",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = tissueCoreUnobservedAreaTokenTool.execute;
export default tissueCoreUnobservedAreaTokenTool;
