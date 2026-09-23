import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly germinatedAt: number;
  readonly sowedAt: number;
  readonly clockOffset: number;
};
export type Output = { readonly elapsed: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    germinatedAt: { type: "number" },
    sowedAt: { type: "number" },
    clockOffset: { type: "number" },
  },
  required: ["germinatedAt", "sowedAt", "clockOffset"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { elapsed: { type: "number" } },
  required: ["elapsed"],
} as const;
/** Compare supplied germination observation timestamps under an explicit clock offset. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { germinatedAt, sowedAt, clockOffset } = request;
  const compute = (): Output => {
    return { elapsed: germinatedAt - sowedAt - clockOffset };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { germinatedAt: 30, sowedAt: 10, clockOffset: 5 },
  output: { elapsed: 15 },
} satisfies ToolExample<Input, Output>;
export const seedGerminationTimeOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "botany/seed-germination-time-offset",
    title: "Seed Germination Time Offset Tool",
    description:
      "Compare supplied germination observation timestamps under an explicit clock offset.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        germinatedAt: { type: "number" },
        sowedAt: { type: "number" },
        clockOffset: { type: "number" },
      },
      required: ["germinatedAt", "sowedAt", "clockOffset"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { elapsed: { type: "number" } },
      required: ["elapsed"],
    },
    ports: {
      inputs: [
        {
          id: "germinatedAt",
          label: "Germinated At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sowedAt",
          label: "Sowed At",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "clockOffset",
          label: "Clock Offset",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "elapsed", label: "Elapsed", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = seedGerminationTimeOffsetTool.execute;
export default seedGerminationTimeOffsetTool;
