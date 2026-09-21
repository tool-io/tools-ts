import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly pathLabels: readonly string[];
  readonly suppliedLabel: string;
  readonly unknownLabel: string;
};
export type Output = {
  readonly matching: number;
  readonly unknown: number;
  readonly other: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    pathLabels: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    suppliedLabel: { type: "string", maxLength: 8192 },
    unknownLabel: { type: "string", maxLength: 8192 },
  },
  required: ["pathLabels", "suppliedLabel", "unknownLabel"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    matching: { type: "integer" },
    unknown: { type: "integer" },
    other: { type: "integer" },
  },
  required: ["matching", "unknown", "other"],
} as const;
/** Count caller-supplied genealogy labels without inferring identity or kinship rules. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { pathLabels, suppliedLabel, unknownLabel } = request;
  const compute = (): Output => {
    H.domain(suppliedLabel !== unknownLabel);
    return {
      matching: pathLabels.filter((x) => x === suppliedLabel).length,
      unknown: pathLabels.filter((x) => x === unknownLabel).length,
      other: pathLabels.filter((x) => x !== suppliedLabel && x !== unknownLabel)
        .length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    pathLabels: ["F", "U", "M", "F"],
    suppliedLabel: "F",
    unknownLabel: "U",
  },
  output: { matching: 2, unknown: 1, other: 1 },
} satisfies ToolExample<Input, Output>;
export const genealogicalPathSexLabelCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "anthropology/genealogical-path-sex-label-count",
    title: "Genealogical Path Sex Label Count Tool",
    description:
      "Count caller-supplied genealogy labels without inferring identity or kinship rules.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        pathLabels: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        suppliedLabel: { type: "string", maxLength: 8192 },
        unknownLabel: { type: "string", maxLength: 8192 },
      },
      required: ["pathLabels", "suppliedLabel", "unknownLabel"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        matching: { type: "integer" },
        unknown: { type: "integer" },
        other: { type: "integer" },
      },
      required: ["matching", "unknown", "other"],
    },
    ports: {
      inputs: [
        {
          id: "pathLabels",
          label: "Path Labels",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "suppliedLabel",
          label: "Supplied Label",
          required: true,
          valueType: { type: "string" },
        },
        {
          id: "unknownLabel",
          label: "Unknown Label",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        { id: "matching", label: "Matching", valueType: { type: "integer" } },
        { id: "unknown", label: "Unknown", valueType: { type: "integer" } },
        { id: "other", label: "Other", valueType: { type: "integer" } },
      ],
    },
  },
  calculate,
});
export const run = genealogicalPathSexLabelCountTool.execute;
export default genealogicalPathSexLabelCountTool;
