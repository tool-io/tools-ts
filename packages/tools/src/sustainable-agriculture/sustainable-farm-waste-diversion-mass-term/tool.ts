import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly generated: number;
  readonly reused: number;
  readonly recycled: number;
  readonly sharedCount: number;
};
export type Output = {
  readonly diverted: number;
  readonly diversionShare: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    generated: { type: "number", exclusiveMinimum: 0 },
    reused: { type: "number", minimum: 0 },
    recycled: { type: "number", minimum: 0 },
    sharedCount: { type: "number", minimum: 0 },
  },
  required: ["generated", "reused", "recycled", "sharedCount"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    diverted: { type: "number" },
    diversionShare: { type: "number" },
    residual: { type: "number" },
  },
  required: ["diverted", "diversionShare", "residual"],
} as const;
/** Calculate sustainable farm waste diversion mass term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { generated, reused, recycled, sharedCount } = request;
  const compute = (): Output => {
    H.positive(generated);
    H.domain(
      reused >= 0 &&
        recycled >= 0 &&
        sharedCount >= 0 &&
        sharedCount <= Math.min(reused, recycled) &&
        reused + recycled - sharedCount <= generated,
    );
    return {
      diverted: reused + recycled - sharedCount,
      diversionShare: (reused + recycled - sharedCount) / generated,
      residual: generated - reused - recycled + sharedCount,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { generated: 100, reused: 30, recycled: 40, sharedCount: 10 },
  output: { diverted: 60, diversionShare: 0.6, residual: 40 },
} satisfies ToolExample<Input, Output>;
export const sustainableFarmWasteDiversionMassTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "sustainable-agriculture/sustainable-farm-waste-diversion-mass-term",
      title: "Sustainable Farm Waste Diversion Mass Term Tool",
      description:
        "Calculate sustainable farm waste diversion mass term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          generated: { type: "number", exclusiveMinimum: 0 },
          reused: { type: "number", minimum: 0 },
          recycled: { type: "number", minimum: 0 },
          sharedCount: { type: "number", minimum: 0 },
        },
        required: ["generated", "reused", "recycled", "sharedCount"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          diverted: { type: "number" },
          diversionShare: { type: "number" },
          residual: { type: "number" },
        },
        required: ["diverted", "diversionShare", "residual"],
      },
      ports: {
        inputs: [
          {
            id: "generated",
            label: "Generated",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "reused",
            label: "Reused",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "recycled",
            label: "Recycled",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "sharedCount",
            label: "Shared Count",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "diverted", label: "Diverted", valueType: { type: "number" } },
          {
            id: "diversionShare",
            label: "Diversion Share",
            valueType: { type: "number", unit: "1" },
          },
          { id: "residual", label: "Residual", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = sustainableFarmWasteDiversionMassTermTool.execute;
export default sustainableFarmWasteDiversionMassTermTool;
