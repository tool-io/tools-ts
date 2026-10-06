import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly collectedSeedMass: number;
  readonly meterRevolutions: number;
};
export type Output = { readonly massPerRevolution: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    collectedSeedMass: { type: "number", minimum: 0 },
    meterRevolutions: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["collectedSeedMass", "meterRevolutions"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { massPerRevolution: { type: "number" } },
  required: ["massPerRevolution"],
} as const;
/** Divide explicitly collected seed mass by observed meter revolutions without recommending a seeding rate. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { collectedSeedMass, meterRevolutions } = request;
  const compute = (): Output => {
    H.domain(collectedSeedMass >= 0, "collectedSeedMass");
    (H.domain(meterRevolutions > 0, "meterRevolutions"), meterRevolutions);
    return { massPerRevolution: collectedSeedMass / meterRevolutions };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { collectedSeedMass: 150, meterRevolutions: 25 },
  output: { massPerRevolution: 6 },
} satisfies ToolExample<Input, Output>;
export const seedMeterRevolutionDischargeTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["agrotechnology", "agriculture"],
      keywords: ["agrotechnology", "agriculture"],
    },
    id: "agrotechnology/seed-meter-revolution-discharge",
    title: "Seed Meter Revolution Discharge",
    description:
      "Divide explicitly collected seed mass by observed meter revolutions without recommending a seeding rate.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        collectedSeedMass: { type: "number", minimum: 0 },
        meterRevolutions: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["collectedSeedMass", "meterRevolutions"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { massPerRevolution: { type: "number" } },
      required: ["massPerRevolution"],
    },
    ports: {
      inputs: [
        {
          id: "collectedSeedMass",
          label: "Collected Seed Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "meterRevolutions",
          label: "Meter Revolutions",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "massPerRevolution",
          label: "Mass Per Revolution",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = seedMeterRevolutionDischargeTool.execute;
export default seedMeterRevolutionDischargeTool;
