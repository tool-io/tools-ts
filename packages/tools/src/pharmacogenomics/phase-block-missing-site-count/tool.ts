import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly expectedSites: readonly string[];
  readonly observedSites: readonly string[];
};
export type Output = {
  readonly missingCount: number;
  readonly missingSites: readonly string[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedSites: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    observedSites: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["expectedSites", "observedSites"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    missingCount: { type: "integer" },
    missingSites: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["missingCount", "missingSites"],
} as const;
/** Count explicitly listed missing research phase-block sites without phasing or clinical variant interpretation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { expectedSites, observedSites } = request;
  const compute = (): Output => {
    return {
      missingCount: new Set(
        expectedSites.filter((x) => !observedSites.includes(x)),
      ).size,
      missingSites: [
        ...new Set(expectedSites.filter((x) => !observedSites.includes(x))),
      ],
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { expectedSites: ["s1", "s2"], observedSites: ["s1"] },
  output: { missingCount: 1, missingSites: ["s2"] },
} satisfies ToolExample<Input, Output>;
export const phaseBlockMissingSiteCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "pharmacogenomics/phase-block-missing-site-count",
    title: "Phase Block Missing Site Count Tool",
    description:
      "Count explicitly listed missing research phase-block sites without phasing or clinical variant interpretation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedSites: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        observedSites: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["expectedSites", "observedSites"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        missingCount: { type: "integer" },
        missingSites: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["missingCount", "missingSites"],
    },
    ports: {
      inputs: [
        {
          id: "expectedSites",
          label: "Expected Sites",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "observedSites",
          label: "Observed Sites",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "missingCount",
          label: "Missing Count",
          valueType: { type: "integer" },
        },
        {
          id: "missingSites",
          label: "Missing Sites",
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
    },
  },
  calculate,
});
export const run = phaseBlockMissingSiteCountTool.execute;
export default phaseBlockMissingSiteCountTool;
