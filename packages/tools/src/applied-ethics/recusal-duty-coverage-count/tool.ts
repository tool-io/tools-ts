import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dutyIds: readonly string[];
  readonly recused: readonly boolean[];
  readonly replacementAssigned: readonly boolean[];
};
export type Output = {
  readonly recusedDuties: number;
  readonly coveredRecusals: number;
  readonly uncoveredRecusals: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dutyIds: {
      type: "array",
      maxItems: 256,
      items: { type: "string", maxLength: 8192 },
    },
    recused: { type: "array", maxItems: 256, items: { type: "boolean" } },
    replacementAssigned: {
      type: "array",
      maxItems: 256,
      items: { type: "boolean" },
    },
  },
  required: ["dutyIds", "recused", "replacementAssigned"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recusedDuties: { type: "integer" },
    coveredRecusals: { type: "integer" },
    uncoveredRecusals: { type: "integer" },
  },
  required: ["recusedDuties", "coveredRecusals", "uncoveredRecusals"],
} as const;
/** Calculate recusal duty coverage count from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dutyIds, recused, replacementAssigned } = request;
  const compute = (): Output => {
    H.sameLength(dutyIds, recused);
    H.sameLength(recused, replacementAssigned);
    H.domain(new Set(dutyIds).size === dutyIds.length);
    return {
      recusedDuties: recused.filter(Boolean).length,
      coveredRecusals: recused.filter((x, i) => x && replacementAssigned[i])
        .length,
      uncoveredRecusals: recused.filter((x, i) => x && !replacementAssigned[i])
        .length,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    dutyIds: ["a", "b", "c"],
    recused: [true, true, false],
    replacementAssigned: [true, false, false],
  },
  output: { recusedDuties: 2, coveredRecusals: 1, uncoveredRecusals: 1 },
} satisfies ToolExample<Input, Output>;
export const recusalDutyCoverageCountTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "applied-ethics/recusal-duty-coverage-count",
    title: "Recusal Duty Coverage Count Tool",
    description:
      "Calculate recusal duty coverage count from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dutyIds: {
          type: "array",
          maxItems: 256,
          items: { type: "string", maxLength: 8192 },
        },
        recused: { type: "array", maxItems: 256, items: { type: "boolean" } },
        replacementAssigned: {
          type: "array",
          maxItems: 256,
          items: { type: "boolean" },
        },
      },
      required: ["dutyIds", "recused", "replacementAssigned"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recusedDuties: { type: "integer" },
        coveredRecusals: { type: "integer" },
        uncoveredRecusals: { type: "integer" },
      },
      required: ["recusedDuties", "coveredRecusals", "uncoveredRecusals"],
    },
    ports: {
      inputs: [
        {
          id: "dutyIds",
          label: "Duty Ids",
          required: true,
          valueType: { type: "list", items: { type: "string" } },
        },
        {
          id: "recused",
          label: "Recused",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
        {
          id: "replacementAssigned",
          label: "Replacement Assigned",
          required: true,
          valueType: { type: "list", items: { type: "boolean" } },
        },
      ],
      outputs: [
        {
          id: "recusedDuties",
          label: "Recused Duties",
          valueType: { type: "integer" },
        },
        {
          id: "coveredRecusals",
          label: "Covered Recusals",
          valueType: { type: "integer" },
        },
        {
          id: "uncoveredRecusals",
          label: "Uncovered Recusals",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = recusalDutyCoverageCountTool.execute;
export default recusalDutyCoverageCountTool;
