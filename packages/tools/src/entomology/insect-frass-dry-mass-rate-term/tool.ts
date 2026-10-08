import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly dryFrassMass: number;
  readonly elapsedTime: number;
};
export type Output = { readonly dryMassRate: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    dryFrassMass: { type: "number", minimum: 0 },
    elapsedTime: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["dryFrassMass", "elapsedTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { dryMassRate: { type: "number" } },
  required: ["dryMassRate"],
} as const;
/** Divide explicit insect frass dry mass by positive collection time in compatible units without inferring consumption. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { dryFrassMass, elapsedTime } = request;
  const compute = (): Output => {
    H.domain(dryFrassMass >= 0, "dryFrassMass");
    (H.domain(Number.isFinite(elapsedTime) && elapsedTime > 0, "elapsedTime"),
      elapsedTime);
    return { dryMassRate: dryFrassMass / elapsedTime };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { dryFrassMass: 12, elapsedTime: 4 },
  output: { dryMassRate: 3 },
} satisfies ToolExample<Input, Output>;
export const insectFrassDryMassRateTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "entomology/insect-frass-dry-mass-rate-term",
    title: "Insect Frass Dry Mass Rate Term Tool",
    description:
      "Divide explicit insect frass dry mass by positive collection time in compatible units without inferring consumption.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        dryFrassMass: { type: "number", minimum: 0 },
        elapsedTime: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["dryFrassMass", "elapsedTime"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { dryMassRate: { type: "number" } },
      required: ["dryMassRate"],
    },
    ports: {
      inputs: [
        {
          id: "dryFrassMass",
          label: "Dry Frass Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "elapsedTime",
          label: "Elapsed Time",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "dryMassRate",
          label: "Dry Mass Rate",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = insectFrassDryMassRateTermTool.execute;
export default insectFrassDryMassRateTermTool;
