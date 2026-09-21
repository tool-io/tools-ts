import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly rowLength: number;
  readonly spacing: number;
  readonly edgeAllowance: number;
  readonly surviving: number;
};
export type Output = {
  readonly targetCount: number;
  readonly replantGap: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    rowLength: { type: "number" },
    spacing: { type: "number", exclusiveMinimum: 0 },
    edgeAllowance: { type: "number", minimum: 0 },
    surviving: { type: "integer", minimum: 0 },
  },
  required: ["rowLength", "spacing", "edgeAllowance", "surviving"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    targetCount: { type: "integer" },
    replantGap: { type: "integer" },
  },
  required: ["targetCount", "replantGap"],
} as const;
/** Calculate agroforestry space row replant budget from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { rowLength, spacing, edgeAllowance, surviving } = request;
  const compute = (): Output => {
    H.positive(spacing);
    H.integer(surviving, 0);
    H.domain(edgeAllowance >= 0 && rowLength >= 2 * edgeAllowance);
    return {
      targetCount: Math.floor((rowLength - 2 * edgeAllowance) / spacing) + 1,
      replantGap: Math.max(
        0,
        Math.floor((rowLength - 2 * edgeAllowance) / spacing) + 1 - surviving,
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { rowLength: 100, spacing: 10, edgeAllowance: 5, surviving: 7 },
  output: { targetCount: 10, replantGap: 3 },
} satisfies ToolExample<Input, Output>;
export const agroforestrySpaceRowReplantBudgetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroforestry/agroforestry-space-row-replant-budget",
    title: "Agroforestry Space Row Replant Budget Tool",
    description:
      "Calculate agroforestry space row replant budget from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        rowLength: { type: "number" },
        spacing: { type: "number", exclusiveMinimum: 0 },
        edgeAllowance: { type: "number", minimum: 0 },
        surviving: { type: "integer", minimum: 0 },
      },
      required: ["rowLength", "spacing", "edgeAllowance", "surviving"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        targetCount: { type: "integer" },
        replantGap: { type: "integer" },
      },
      required: ["targetCount", "replantGap"],
    },
    ports: {
      inputs: [
        {
          id: "rowLength",
          label: "Row Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "spacing",
          label: "Spacing",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "edgeAllowance",
          label: "Edge Allowance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "surviving",
          label: "Surviving",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "targetCount",
          label: "Target Count",
          valueType: { type: "integer" },
        },
        {
          id: "replantGap",
          label: "Replant Gap",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = agroforestrySpaceRowReplantBudgetTool.execute;
export default agroforestrySpaceRowReplantBudgetTool;
