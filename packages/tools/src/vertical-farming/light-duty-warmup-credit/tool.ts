import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly scheduledHours: number;
  readonly warmupHours: number;
  readonly suppliedWarmupPowerFraction: number;
  readonly fullPower: number;
};
export type Output = {
  readonly equivalentFullPowerHours: number;
  readonly energy: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    scheduledHours: { type: "number", minimum: 0 },
    warmupHours: { type: "number", minimum: 0 },
    suppliedWarmupPowerFraction: { type: "number", minimum: 0, maximum: 1 },
    fullPower: { type: "number", minimum: 0 },
  },
  required: [
    "scheduledHours",
    "warmupHours",
    "suppliedWarmupPowerFraction",
    "fullPower",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    equivalentFullPowerHours: { type: "number" },
    energy: { type: "number" },
  },
  required: ["equivalentFullPowerHours", "energy"],
} as const;
/** Supplied lighting energy ledger under an explicit constant warmup-power approximation. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    scheduledHours,
    warmupHours,
    suppliedWarmupPowerFraction,
    fullPower,
  } = request;
  const compute = (): Output => {
    H.probability(suppliedWarmupPowerFraction);
    H.domain(
      scheduledHours >= 0 &&
        warmupHours >= 0 &&
        warmupHours <= scheduledHours &&
        fullPower >= 0,
    );
    return {
      equivalentFullPowerHours:
        scheduledHours -
        warmupHours +
        warmupHours * suppliedWarmupPowerFraction,
      energy:
        (scheduledHours -
          warmupHours +
          warmupHours * suppliedWarmupPowerFraction) *
        fullPower,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    scheduledHours: 12,
    warmupHours: 2,
    suppliedWarmupPowerFraction: 0.5,
    fullPower: 100,
  },
  output: { equivalentFullPowerHours: 11, energy: 1100 },
} satisfies ToolExample<Input, Output>;
export const lightDutyWarmupCreditTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "vertical-farming/light-duty-warmup-credit",
    title: "Light Duty Warmup Credit Tool",
    description:
      "Supplied lighting energy ledger under an explicit constant warmup-power approximation.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        scheduledHours: { type: "number", minimum: 0 },
        warmupHours: { type: "number", minimum: 0 },
        suppliedWarmupPowerFraction: { type: "number", minimum: 0, maximum: 1 },
        fullPower: { type: "number", minimum: 0 },
      },
      required: [
        "scheduledHours",
        "warmupHours",
        "suppliedWarmupPowerFraction",
        "fullPower",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        equivalentFullPowerHours: { type: "number" },
        energy: { type: "number" },
      },
      required: ["equivalentFullPowerHours", "energy"],
    },
    ports: {
      inputs: [
        {
          id: "scheduledHours",
          label: "Scheduled Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "warmupHours",
          label: "Warmup Hours",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedWarmupPowerFraction",
          label: "Supplied Warmup Power Fraction",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "fullPower",
          label: "Full Power",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "equivalentFullPowerHours",
          label: "Equivalent Full Power Hours",
          valueType: { type: "number" },
        },
        { id: "energy", label: "Energy", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = lightDutyWarmupCreditTool.execute;
export default lightDutyWarmupCreditTool;
