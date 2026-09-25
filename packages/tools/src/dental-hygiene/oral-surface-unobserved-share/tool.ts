import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly surfaceIds: readonly string[];
  readonly observed: readonly boolean[];
  readonly eligible: readonly boolean[];
};
export type Output = {
  readonly eligibleSurfaces: number;
  readonly unobservedSurfaces: number;
  readonly unobservedShare: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    surfaceIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    observed: { type: "array", maxItems: 256, items: { type: "boolean" } },
    eligible: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["surfaceIds", "observed", "eligible"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    eligibleSurfaces: { type: "integer" },
    unobservedSurfaces: { type: "integer" },
    unobservedShare: { type: "number" },
    defined: { type: "boolean" },
  },
  required: [
    "eligibleSurfaces",
    "unobservedSurfaces",
    "unobservedShare",
    "defined",
  ],
} as const;
/** Deduplicate explicitly eligible research surfaces and count those with no observation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { surfaceIds, observed, eligible } = request;
  const compute = (): Output => {
    H.sameLength(surfaceIds, observed);
    H.sameLength(surfaceIds, eligible);
    return (() => {
      const a = new Set(surfaceIds.filter((x, i) => eligible[i])),
        b = new Set(surfaceIds.filter((x, i) => eligible[i] && observed[i]));
      return {
        eligibleSurfaces: a.size,
        unobservedSurfaces: a.size - b.size,
        unobservedShare: a.size > 0 ? (a.size - b.size) / a.size : 0,
        defined: a.size > 0,
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    surfaceIds: ["a", "a", "b"],
    observed: [true, false, false],
    eligible: [true, true, true],
  },
  output: {
    eligibleSurfaces: 2,
    unobservedSurfaces: 1,
    unobservedShare: 0.5,
    defined: true,
  },
} satisfies ToolExample<Input, Output>;
export const oralSurfaceUnobservedShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "dental-hygiene/oral-surface-unobserved-share",
    title: "Oral Surface Unobserved Share Tool",
    description:
      "Deduplicate explicitly eligible research surfaces and count those with no observation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        surfaceIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        observed: { type: "array", maxItems: 256, items: { type: "boolean" } },
        eligible: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["surfaceIds", "observed", "eligible"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        eligibleSurfaces: { type: "integer" },
        unobservedSurfaces: { type: "integer" },
        unobservedShare: { type: "number" },
        defined: { type: "boolean" },
      },
      required: [
        "eligibleSurfaces",
        "unobservedSurfaces",
        "unobservedShare",
        "defined",
      ],
    },
    ports: {
      inputs: [
        {
          id: "surfaceIds",
          label: "Surface Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "eligible",
          label: "Eligible",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "eligibleSurfaces",
          label: "Eligible Surfaces",
          valueType: { type: "integer" },
        },
        {
          id: "unobservedSurfaces",
          label: "Unobserved Surfaces",
          valueType: { type: "integer" },
        },
        {
          id: "unobservedShare",
          label: "Unobserved Share",
          valueType: { type: "number" },
        },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = oralSurfaceUnobservedShareTool.execute;
export default oralSurfaceUnobservedShareTool;
