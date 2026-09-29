import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly settlementArea: number;
  readonly totalArea: number;
};
export type Output = { readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    settlementArea: { type: "number", minimum: 0 },
    totalArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["settlementArea", "totalArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" } },
  required: ["share"],
} as const;
/** Calculate settlement area share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { settlementArea, totalArea } = request;
  const compute = (): Output => {
    H.positive(totalArea);
    H.domain(settlementArea >= 0 && settlementArea <= totalArea);
    return { share: settlementArea / totalArea };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { settlementArea: 3, totalArea: 12 },
  output: { share: 0.25 },
} satisfies ToolExample<Input, Output>;
export const settlementAreaShareTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "human-geography/settlement-area-share",
      title: "Settlement Area Share Tool",
      description:
        "Calculate settlement area share from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          settlementArea: { type: "number", minimum: 0 },
          totalArea: { type: "number", exclusiveMinimum: 0 },
        },
        required: ["settlementArea", "totalArea"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { share: { type: "number" } },
        required: ["share"],
      },
      ports: {
        inputs: [
          {
            id: "settlementArea",
            label: "Settlement Area",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "totalArea",
            label: "Total Area",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "share", label: "Share", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  },
);
export const run = settlementAreaShareTool.execute;
export default settlementAreaShareTool;
