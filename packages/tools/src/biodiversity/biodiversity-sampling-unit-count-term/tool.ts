import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observedCount: number;
  readonly representedUnitCount: number;
};
export type Output = { readonly meanPerRepresentedUnit: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedCount: { type: "integer", minimum: 0 },
    representedUnitCount: { type: "integer", minimum: 1 },
  },
  required: ["observedCount", "representedUnitCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { meanPerRepresentedUnit: { type: "number" } },
  required: ["meanPerRepresentedUnit"],
} as const;
/** Divide supplied biodiversity observation count by a positive represented sampling-unit count without asserting independent sampling. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observedCount, representedUnitCount } = request;
  const compute = (): Output => {
    (H.domain(
      Number.isSafeInteger(observedCount) &&
        observedCount >= 0 &&
        observedCount <= Number.MAX_SAFE_INTEGER,
      "observedCount",
    ),
      observedCount);
    (H.domain(
      Number.isSafeInteger(representedUnitCount) &&
        representedUnitCount >= 1 &&
        representedUnitCount <= Number.MAX_SAFE_INTEGER,
      "representedUnitCount",
    ),
      representedUnitCount);
    return { meanPerRepresentedUnit: observedCount / representedUnitCount };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observedCount: 24, representedUnitCount: 6 },
  output: { meanPerRepresentedUnit: 4 },
} satisfies ToolExample<Input, Output>;
export const biodiversitySamplingUnitCountTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["biodiversity", "biology"],
      keywords: ["biodiversity", "biology"],
    },
    id: "biodiversity/biodiversity-sampling-unit-count-term",
    title: "Biodiversity Sampling Unit Count Term",
    description:
      "Divide supplied biodiversity observation count by a positive represented sampling-unit count without asserting independent sampling.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedCount: { type: "integer", minimum: 0 },
        representedUnitCount: { type: "integer", minimum: 1 },
      },
      required: ["observedCount", "representedUnitCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { meanPerRepresentedUnit: { type: "number" } },
      required: ["meanPerRepresentedUnit"],
    },
    ports: {
      inputs: [
        {
          id: "observedCount",
          label: "Observed Count",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "representedUnitCount",
          label: "Represented Unit Count",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "meanPerRepresentedUnit",
          label: "Mean Per Represented Unit",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = biodiversitySamplingUnitCountTermTool.execute;
export default biodiversitySamplingUnitCountTermTool;
