import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly observed: readonly boolean[];
  readonly sampled: readonly boolean[];
};
export type Output = {
  readonly supportedPresences: number;
  readonly unsupportedPresences: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observed: { type: "array", maxItems: 256, items: { type: "boolean" } },
    sampled: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["observed", "sampled"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    supportedPresences: { type: "integer" },
    unsupportedPresences: { type: "integer" },
  },
  required: ["supportedPresences", "unsupportedPresences"],
} as const;
/** Calculate taxon incidence support count from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { observed, sampled } = request;
  const compute = (): Output => {
    H.sameLength(observed, sampled);
    return {
      supportedPresences: observed.filter((x, i) => x && sampled[i]).length,
      unsupportedPresences: observed.filter((x, i) => x && !sampled[i]).length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { observed: [true, true, false], sampled: [true, false, true] },
  output: { supportedPresences: 1, unsupportedPresences: 1 },
} satisfies ToolExample<Input, Output>;
export const taxonIncidenceSupportCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biodiversity/taxon-incidence-support-count",
    title: "Taxon Incidence Support Count Tool",
    description:
      "Calculate taxon incidence support count from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observed: { type: "array", maxItems: 256, items: { type: "boolean" } },
        sampled: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["observed", "sampled"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        supportedPresences: { type: "integer" },
        unsupportedPresences: { type: "integer" },
      },
      required: ["supportedPresences", "unsupportedPresences"],
    },
    ports: {
      inputs: [
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "sampled",
          label: "Sampled",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "supportedPresences",
          label: "Supported Presences",
          valueType: { type: "integer" },
        },
        {
          id: "unsupportedPresences",
          label: "Unsupported Presences",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = taxonIncidenceSupportCountTool.execute;
export default taxonIncidenceSupportCountTool;
