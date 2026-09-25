import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly included: readonly boolean[];
  readonly contextValid: readonly boolean[];
};
export type Output = {
  readonly includedCount: number;
  readonly validCount: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    included: { type: "array", maxItems: 256, items: { type: "boolean" } },
    contextValid: { type: "array", maxItems: 256, items: { type: "boolean" } },
  },
  required: ["included", "contextValid"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    includedCount: { type: "integer" },
    validCount: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["includedCount", "validCount", "share", "defined"],
} as const;
/** Calculate observation context validity share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { included, contextValid } = request;
  const compute = (): Output => {
    H.sameLength(included, contextValid);
    return {
      includedCount: included.filter(Boolean).length,
      validCount: included.filter((x, i) => x && contextValid[i]).length,
      share: included.some(Boolean)
        ? included.filter((x, i) => x && contextValid[i]).length /
          included.filter(Boolean).length
        : 0,
      defined: included.some(Boolean),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { included: [true, true, false], contextValid: [true, false, true] },
  output: { includedCount: 2, validCount: 1, share: 0.5, defined: true },
} satisfies ToolExample<Input, Output>;
export const observationContextValidityShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "cultural-anthropology/observation-context-validity-share",
    title: "Observation Context Validity Share Tool",
    description:
      "Calculate observation context validity share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        included: { type: "array", maxItems: 256, items: { type: "boolean" } },
        contextValid: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["included", "contextValid"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        includedCount: { type: "integer" },
        validCount: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["includedCount", "validCount", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "included",
          label: "Included",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "contextValid",
          label: "Context Valid",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "includedCount",
          label: "Included Count",
          valueType: { type: "integer" },
        },
        {
          id: "validCount",
          label: "Valid Count",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = observationContextValidityShareTool.execute;
export default observationContextValidityShareTool;
