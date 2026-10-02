import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly values: readonly number[];
  readonly censored: readonly boolean[];
  readonly missing: readonly boolean[];
};
export type Output = {
  readonly observedIndices: readonly number[];
  readonly censoredIndices: readonly number[];
  readonly missingIndices: readonly number[];
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    values: { type: "array", maxItems: 256, items: { type: "number" } },
    censored: { type: "array", maxItems: 256, items: { type: "boolean" } },
    missing: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["values", "censored", "missing"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    observedIndices: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    censoredIndices: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
    missingIndices: {
      type: "array",
      maxItems: 256,
      items: { type: "integer" },
    },
  },
  required: ["observedIndices", "censoredIndices", "missingIndices"],
} as const;
/** Keep explicitly censored observations separate from missing sites. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { values, censored, missing } = request;
  const compute = (): Output => {
    H.sameLength(values, censored);
    H.sameLength(values, missing);
    H.domain(
      censored.every((x, i) => !x || !missing[i]),
      "censored",
    );
    return {
      observedIndices: values.flatMap((_, i) =>
        !censored[i] && !missing[i] ? [i] : [],
      ),
      censoredIndices: censored.flatMap((x, i) => (x ? [i] : [])),
      missingIndices: missing.flatMap((x, i) => (x ? [i] : [])),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    values: [1, 2, 3],
    censored: [false, true, false],
    missing: [false, false, true],
  },
  output: { observedIndices: [0], censoredIndices: [1], missingIndices: [2] },
} satisfies ToolExample<Input, Output>;
export const periodontalStudyCensoredSiteMaskTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "periodontology/periodontal-study-censored-site-mask",
    title: "Periodontal Study Censored Site Mask Tool",
    description:
      "Keep explicitly censored observations separate from missing sites.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        values: { type: "array", maxItems: 256, items: { type: "number" } },
        censored: { type: "array", maxItems: 256, items: { type: "boolean" } },
        missing: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["values", "censored", "missing"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        observedIndices: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        censoredIndices: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
        missingIndices: {
          type: "array",
          maxItems: 256,
          items: { type: "integer" },
        },
      },
      required: ["observedIndices", "censoredIndices", "missingIndices"],
    },
    ports: {
      inputs: [
        {
          id: "values",
          label: "Values",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "censored",
          label: "Censored",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "missing",
          label: "Missing",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "observedIndices",
          label: "Observed Indices",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "censoredIndices",
          label: "Censored Indices",
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "missingIndices",
          label: "Missing Indices",
          valueType: { type: "list", items: { type: "integer" } },
        },
      ],
    },
  },
  calculate,
});
export const run = periodontalStudyCensoredSiteMaskTool.execute;
export default periodontalStudyCensoredSiteMaskTool;
