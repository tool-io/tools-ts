import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly findingIds: readonly string[];
  readonly responseFindingIds: readonly string[];
};
export type Output = {
  readonly coveredFindings: number;
  readonly totalFindings: number;
  readonly share: number;
  readonly defined: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    findingIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    responseFindingIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
  },
  required: ["findingIds", "responseFindingIds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    coveredFindings: { type: "integer" },
    totalFindings: { type: "integer" },
    share: { type: "number" },
    defined: { type: "boolean" },
  },
  required: ["coveredFindings", "totalFindings", "share", "defined"],
} as const;
/** Calculate finding response coverage share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { findingIds, responseFindingIds } = request;
  const compute = (): Output => {
    return {
      coveredFindings: new Set(
        findingIds.filter((x) => responseFindingIds.includes(x)),
      ).size,
      totalFindings: new Set(findingIds).size,
      share: findingIds.length
        ? new Set(findingIds.filter((x) => responseFindingIds.includes(x)))
            .size / new Set(findingIds).size
        : 0,
      defined: findingIds.length > 0,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { findingIds: ["a", "b", "b"], responseFindingIds: ["b"] },
  output: { coveredFindings: 1, totalFindings: 2, share: 0.5, defined: true },
} satisfies ToolExample<Input, Output>;
export const findingResponseCoverageShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "quality-assurance/finding-response-coverage-share",
    title: "Finding Response Coverage Share Tool",
    description:
      "Calculate finding response coverage share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        findingIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        responseFindingIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
      },
      required: ["findingIds", "responseFindingIds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        coveredFindings: { type: "integer" },
        totalFindings: { type: "integer" },
        share: { type: "number" },
        defined: { type: "boolean" },
      },
      required: ["coveredFindings", "totalFindings", "share", "defined"],
    },
    ports: {
      inputs: [
        {
          id: "findingIds",
          label: "Finding Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "responseFindingIds",
          label: "Response Finding Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
      ],
      outputs: [
        {
          id: "coveredFindings",
          label: "Covered Findings",
          valueType: { type: "integer" },
        },
        {
          id: "totalFindings",
          label: "Total Findings",
          valueType: { type: "integer" },
        },
        { id: "share", label: "Share", valueType: { type: "number" } },
        { id: "defined", label: "Defined", valueType: { type: "boolean" } },
      ],
    },
  },
  calculate,
});
export const run = findingResponseCoverageShareTool.execute;
export default findingResponseCoverageShareTool;
