import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly preMass: number;
  readonly postMass: number;
  readonly blankChange: number;
  readonly sampledVolume: number;
  readonly recovery: number;
};
export type Output = {
  readonly netMass: number;
  readonly recoveredMass: number;
  readonly concentration: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    preMass: { type: "number" },
    postMass: { type: "number" },
    blankChange: { type: "number" },
    sampledVolume: { type: "number", exclusiveMinimum: 0 },
    recovery: { type: "number", exclusiveMinimum: 0, maximum: 1 },
  },
  required: ["preMass", "postMass", "blankChange", "sampledVolume", "recovery"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netMass: { type: "number" },
    recoveredMass: { type: "number" },
    concentration: { type: "number" },
  },
  required: ["netMass", "recoveredMass", "concentration"],
} as const;
/** Signed field-blank correction with supplied sample volume and recovery. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { preMass, postMass, blankChange, sampledVolume, recovery } = request;
  const compute = (): Output => {
    H.positive(sampledVolume);
    H.domain(recovery > 0 && recovery <= 1);
    return {
      netMass: postMass - preMass - blankChange,
      recoveredMass: (postMass - preMass - blankChange) / recovery,
      concentration:
        (postMass - preMass - blankChange) / (sampledVolume * recovery),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    preMass: 10,
    postMass: 12,
    blankChange: 0.2,
    sampledVolume: 3,
    recovery: 0.9,
  },
  output: { netMass: 1.8, recoveredMass: 2, concentration: 0.6666666666666666 },
} satisfies ToolExample<Input, Output>;
export const workplaceAirBlankMassCorrectionTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "occupational-health/workplace-air-blank-mass-correction",
    title: "Workplace Air Blank Mass Correction Tool",
    description:
      "Signed field-blank correction with supplied sample volume and recovery.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        preMass: { type: "number" },
        postMass: { type: "number" },
        blankChange: { type: "number" },
        sampledVolume: { type: "number", exclusiveMinimum: 0 },
        recovery: { type: "number", exclusiveMinimum: 0, maximum: 1 },
      },
      required: [
        "preMass",
        "postMass",
        "blankChange",
        "sampledVolume",
        "recovery",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        netMass: { type: "number" },
        recoveredMass: { type: "number" },
        concentration: { type: "number" },
      },
      required: ["netMass", "recoveredMass", "concentration"],
    },
    ports: {
      inputs: [
        {
          id: "preMass",
          label: "Pre Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "postMass",
          label: "Post Mass",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "blankChange",
          label: "Blank Change",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sampledVolume",
          label: "Sampled Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "recovery",
          label: "Recovery",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "netMass", label: "Net Mass", valueType: { type: "number" } },
        {
          id: "recoveredMass",
          label: "Recovered Mass",
          valueType: { type: "number" },
        },
        {
          id: "concentration",
          label: "Concentration",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = workplaceAirBlankMassCorrectionTool.execute;
export default workplaceAirBlankMassCorrectionTool;
