import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly weights: readonly number[];
  readonly observed: readonly boolean[];
};
export type Output = {
  readonly missingWeight: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    weights: {
      type: "array",
      maxItems: 256,
      items: { type: "number", minimum: 0 },
    },
    observed: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["weights", "observed"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    missingWeight: { type: "number" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["missingWeight", "share", "defined"],
} as const;
/** Calculate trait weight missing share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { weights, observed } = request;
  const compute = (): Output => {
    H.sameLength(weights, observed);
    H.domain(weights.every((x) => x >= 0));
    return {
      missingWeight: weights.reduce((s, x, i) => s + (!observed[i] ? x : 0), 0),
      share: weights.some((x) => x > 0)
        ? weights.reduce((s, x, i) => s + (!observed[i] ? x : 0), 0) /
          weights.reduce((a, b) => a + b, 0)
        : 0,
      defined: weights.some((x) => x > 0),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { weights: [1, 3], observed: [true, false] },
  output: { missingWeight: 3, share: 0.75, defined: true },
} satisfies ToolExample<Input, Output>;
export const traitWeightMissingShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "ecology/trait-weight-missing-share",
    title: "Trait Weight Missing Share Tool",
    description:
      "Calculate trait weight missing share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        weights: {
          type: "array",
          maxItems: 256,
          items: { type: "number", minimum: 0 },
        },
        observed: { type: "array", maxItems: 256, items: { type: "boolean" } },
      },
      required: ["weights", "observed"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        missingWeight: { type: "number" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["missingWeight", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "weights",
          label: "Weights",
          required: true,
          valueType: { type: "list", items: { type: "number" } },
        },
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "missingWeight",
          label: "Missing Weight",
          valueType: { type: "number" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = traitWeightMissingShareTool.execute;
export default traitWeightMissingShareTool;
