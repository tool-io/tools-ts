import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly gradeCounts: readonly number[];
  readonly totalHarvestCount: string;
  readonly rejectedCount: string;
};
export type Output = {
  readonly gradedDecimal: string;
  readonly unassignedDecimal: string;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gradeCounts: {
      type: "array",
      maxItems: 256,
      items: { type: "integer", minimum: 0 },
    },
    totalHarvestCount: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    rejectedCount: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
  },
  required: ["gradeCounts", "totalHarvestCount", "rejectedCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gradedDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
    unassignedDecimal: {
      type: "string",
      maxLength: 8192,
      format: "integer-decimal",
    },
  },
  required: ["gradedDecimal", "unassignedDecimal"],
} as const;
/** Calculate harvest grade count residual from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { gradeCounts, totalHarvestCount, rejectedCount } = request;
  const compute = (): Output => {
    H.domain(gradeCounts.every((x) => x >= 0));
    return (() => {
      const total = H.decimal(totalHarvestCount),
        rejected = H.decimal(rejectedCount),
        graded = gradeCounts.reduce((s, x) => s + BigInt(x), 0n);
      H.domain(total >= 0n && rejected >= 0n);
      return {
        gradedDecimal: graded.toString(),
        unassignedDecimal: (total - rejected - graded).toString(),
      };
    })();
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { gradeCounts: [20, 30], totalHarvestCount: "60", rejectedCount: "5" },
  output: { gradedDecimal: "50", unassignedDecimal: "5" },
} satisfies ToolExample<Input, Output>;
export const harvestGradeCountResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "aquaculture/harvest-grade-count-residual",
    title: "Harvest Grade Count Residual Tool",
    description:
      "Calculate harvest grade count residual from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gradeCounts: {
          type: "array",
          maxItems: 256,
          items: { type: "integer", minimum: 0 },
        },
        totalHarvestCount: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        rejectedCount: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
      },
      required: ["gradeCounts", "totalHarvestCount", "rejectedCount"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        gradedDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
        unassignedDecimal: {
          type: "string",
          maxLength: 8192,
          format: "integer-decimal",
        },
      },
      required: ["gradedDecimal", "unassignedDecimal"],
    },
    ports: {
      inputs: [
        {
          id: "gradeCounts",
          label: "Grade Counts",
          required: true,
          valueType: { type: "list", items: { type: "integer" } },
        },
        {
          id: "totalHarvestCount",
          label: "Total Harvest Count",
          required: true,
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "rejectedCount",
          label: "Rejected Count",
          required: true,
          valueType: { type: "string", format: "integer-decimal" },
        },
      ],
      outputs: [
        {
          id: "gradedDecimal",
          label: "Graded Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
        {
          id: "unassignedDecimal",
          label: "Unassigned Decimal",
          valueType: { type: "string", format: "integer-decimal" },
        },
      ],
    },
  },
  calculate,
});
export const run = harvestGradeCountResidualTool.execute;
export default harvestGradeCountResidualTool;
