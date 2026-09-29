import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly physical: number;
  readonly quarantine: number;
  readonly hold: number;
  readonly overlappingHold: number;
  readonly reserved: number;
};
export type Output = {
  readonly blockedUnion: number;
  readonly available: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    physical: { type: "integer", minimum: 0 },
    quarantine: { type: "integer", minimum: 0 },
    hold: { type: "integer", minimum: 0 },
    overlappingHold: { type: "integer", minimum: 0 },
    reserved: { type: "integer", minimum: 0 },
  },
  required: ["physical", "quarantine", "hold", "overlappingHold", "reserved"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    blockedUnion: { type: "integer" },
    available: { type: "integer" },
  },
  required: ["blockedUnion", "available"],
} as const;
/** Calculate hospital pharmacy quarantined available balance from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { physical, quarantine, hold, overlappingHold, reserved } = request;
  const compute = (): Output => {
    H.integer(physical, 0);
    H.integer(quarantine, 0, physical);
    H.integer(hold, 0, physical);
    H.integer(overlappingHold, 0, Math.min(quarantine, hold));
    H.integer(reserved, 0);
    H.domain(quarantine + hold - overlappingHold <= physical);
    return {
      blockedUnion: quarantine + hold - overlappingHold,
      available: physical - quarantine - hold + overlappingHold - reserved,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    physical: 100,
    quarantine: 20,
    hold: 15,
    overlappingHold: 5,
    reserved: 10,
  },
  output: { blockedUnion: 30, available: 60 },
} satisfies ToolExample<Input, Output>;
export const hospitalPharmacyQuarantinedAvailableBalanceTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "hospital-pharmacy/hospital-pharmacy-quarantined-available-balance",
      title: "Hospital Pharmacy Quarantined Available Balance Tool",
      description:
        "Calculate hospital pharmacy quarantined available balance from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          physical: { type: "integer", minimum: 0 },
          quarantine: { type: "integer", minimum: 0 },
          hold: { type: "integer", minimum: 0 },
          overlappingHold: { type: "integer", minimum: 0 },
          reserved: { type: "integer", minimum: 0 },
        },
        required: [
          "physical",
          "quarantine",
          "hold",
          "overlappingHold",
          "reserved",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          blockedUnion: { type: "integer" },
          available: { type: "integer" },
        },
        required: ["blockedUnion", "available"],
      },
      ports: {
        inputs: [
          {
            id: "physical",
            label: "Physical",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "quarantine",
            label: "Quarantine",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "hold",
            label: "Hold",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "overlappingHold",
            label: "Overlapping Hold",
            required: true,
            valueType: { type: "integer" },
          },
          {
            id: "reserved",
            label: "Reserved",
            required: true,
            valueType: { type: "integer" },
          },
        ],
        outputs: [
          {
            id: "blockedUnion",
            label: "Blocked Union",
            valueType: { type: "integer" },
          },
          {
            id: "available",
            label: "Available",
            valueType: { type: "integer" },
          },
        ],
      },
    },
    calculate,
  });
export const run = hospitalPharmacyQuarantinedAvailableBalanceTool.execute;
export default hospitalPharmacyQuarantinedAvailableBalanceTool;
