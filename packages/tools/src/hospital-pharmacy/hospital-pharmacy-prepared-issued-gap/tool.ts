import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly prepared: number;
  readonly issued: number;
  readonly returned: number;
  readonly discarded: number;
};
export type Output = {
  readonly held: number;
  readonly netIssued: number;
  readonly unissuedShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    prepared: { type: "integer", minimum: 1 },
    issued: { type: "integer", minimum: 0 },
    returned: { type: "integer", minimum: 0 },
    discarded: { type: "integer", minimum: 0 },
  },
  required: ["prepared", "issued", "returned", "discarded"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    held: { type: "integer" },
    netIssued: { type: "integer" },
    unissuedShare: { type: "number" },
  },
  required: ["held", "netIssued", "unissuedShare"],
} as const;
/** Calculate hospital pharmacy prepared issued gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { prepared, issued, returned, discarded } = request;
  const compute = (): Output => {
    H.integer(prepared, 1);
    H.integer(issued, 0, prepared);
    H.integer(returned, 0, issued);
    H.integer(discarded, 0, prepared - issued + returned);
    return {
      held: prepared - issued + returned - discarded,
      netIssued: issued - returned,
      unissuedShare: (prepared - issued + returned - discarded) / prepared,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { prepared: 100, issued: 70, returned: 5, discarded: 10 },
  output: { held: 25, netIssued: 65, unissuedShare: 0.25 },
} satisfies ToolExample<Input, Output>;
export const hospitalPharmacyPreparedIssuedGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospital-pharmacy/hospital-pharmacy-prepared-issued-gap",
    title: "Hospital Pharmacy Prepared Issued Gap Tool",
    description:
      "Calculate hospital pharmacy prepared issued gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        prepared: { type: "integer", minimum: 1 },
        issued: { type: "integer", minimum: 0 },
        returned: { type: "integer", minimum: 0 },
        discarded: { type: "integer", minimum: 0 },
      },
      required: ["prepared", "issued", "returned", "discarded"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        held: { type: "integer" },
        netIssued: { type: "integer" },
        unissuedShare: { type: "number" },
      },
      required: ["held", "netIssued", "unissuedShare"],
    },
    ports: {
      inputs: [
        {
          id: "prepared",
          label: "Prepared",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "issued",
          label: "Issued",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "returned",
          label: "Returned",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "discarded",
          label: "Discarded",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        { id: "held", label: "Held", valueType: { type: "integer" } },
        {
          id: "netIssued",
          label: "Net Issued",
          valueType: { type: "integer" },
        },
        {
          id: "unissuedShare",
          label: "Unissued Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = hospitalPharmacyPreparedIssuedGapTool.execute;
export default hospitalPharmacyPreparedIssuedGapTool;
