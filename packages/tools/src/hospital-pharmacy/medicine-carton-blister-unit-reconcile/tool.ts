import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly cartons: number;
  readonly blistersPerCarton: number;
  readonly unitsPerBlister: number;
  readonly looseBlisters: number;
  readonly looseUnits: number;
  readonly declared: number;
};
export type Output = {
  readonly calculated: number;
  readonly discrepancy: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    cartons: { type: "integer", minimum: 0 },
    blistersPerCarton: { type: "integer", minimum: 1 },
    unitsPerBlister: { type: "integer", minimum: 1 },
    looseBlisters: { type: "integer", minimum: 0 },
    looseUnits: { type: "integer", minimum: 0 },
    declared: { type: "integer", minimum: 0 },
  },
  required: [
    "cartons",
    "blistersPerCarton",
    "unitsPerBlister",
    "looseBlisters",
    "looseUnits",
    "declared",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    calculated: { type: "integer" },
    discrepancy: { type: "integer" },
  },
  required: ["calculated", "discrepancy"],
} as const;
/** Calculate medicine carton blister unit reconcile from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    cartons,
    blistersPerCarton,
    unitsPerBlister,
    looseBlisters,
    looseUnits,
    declared,
  } = request;
  const compute = (): Output => {
    H.integer(cartons, 0);
    H.integer(blistersPerCarton, 1);
    H.integer(unitsPerBlister, 1);
    H.integer(looseBlisters, 0);
    H.integer(looseUnits, 0);
    H.integer(declared, 0);
    return {
      calculated:
        (cartons * blistersPerCarton + looseBlisters) * unitsPerBlister +
        looseUnits,
      discrepancy:
        (cartons * blistersPerCarton + looseBlisters) * unitsPerBlister +
        looseUnits -
        declared,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    cartons: 2,
    blistersPerCarton: 3,
    unitsPerBlister: 10,
    looseBlisters: 1,
    looseUnits: 5,
    declared: 70,
  },
  output: { calculated: 75, discrepancy: 5 },
} satisfies ToolExample<Input, Output>;
export const medicineCartonBlisterUnitReconcileTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospital-pharmacy/medicine-carton-blister-unit-reconcile",
    title: "Medicine Carton Blister Unit Reconcile Tool",
    description:
      "Calculate medicine carton blister unit reconcile from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        cartons: { type: "integer", minimum: 0 },
        blistersPerCarton: { type: "integer", minimum: 1 },
        unitsPerBlister: { type: "integer", minimum: 1 },
        looseBlisters: { type: "integer", minimum: 0 },
        looseUnits: { type: "integer", minimum: 0 },
        declared: { type: "integer", minimum: 0 },
      },
      required: [
        "cartons",
        "blistersPerCarton",
        "unitsPerBlister",
        "looseBlisters",
        "looseUnits",
        "declared",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        calculated: { type: "integer" },
        discrepancy: { type: "integer" },
      },
      required: ["calculated", "discrepancy"],
    },
    ports: {
      inputs: [
        {
          id: "cartons",
          label: "Cartons",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "blistersPerCarton",
          label: "Blisters Per Carton",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unitsPerBlister",
          label: "Units Per Blister",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "looseBlisters",
          label: "Loose Blisters",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "looseUnits",
          label: "Loose Units",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "declared",
          label: "Declared",
          required: true,
          valueType: { type: "integer" },
        },
      ],
      outputs: [
        {
          id: "calculated",
          label: "Calculated",
          valueType: { type: "integer" },
        },
        {
          id: "discrepancy",
          label: "Discrepancy",
          valueType: { type: "integer" },
        },
      ],
    },
  },
  calculate,
});
export const run = medicineCartonBlisterUnitReconcileTool.execute;
export default medicineCartonBlisterUnitReconcileTool;
