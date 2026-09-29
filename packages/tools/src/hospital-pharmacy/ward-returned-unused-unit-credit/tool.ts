import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly returned: number;
  readonly reusable: number;
  readonly unitCost: number;
  readonly handlingCost: number;
};
export type Output = {
  readonly credit: number;
  readonly rejected: number;
  readonly netCredit: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    returned: { type: "integer", minimum: 0 },
    reusable: { type: "integer", minimum: 0 },
    unitCost: { type: "number", minimum: 0 },
    handlingCost: { type: "number", minimum: 0 },
  },
  required: ["returned", "reusable", "unitCost", "handlingCost"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    credit: { type: "number" },
    rejected: { type: "integer" },
    netCredit: { type: "number" },
  },
  required: ["credit", "rejected", "netCredit"],
} as const;
/** Calculate ward returned unused unit credit from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { returned, reusable, unitCost, handlingCost } = request;
  const compute = (): Output => {
    H.integer(returned, 0);
    H.integer(reusable, 0, returned);
    H.domain(unitCost >= 0 && handlingCost >= 0);
    return {
      credit: reusable * unitCost,
      rejected: returned - reusable,
      netCredit: reusable * unitCost - handlingCost,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { returned: 20, reusable: 15, unitCost: 2, handlingCost: 5 },
  output: { credit: 30, rejected: 5, netCredit: 25 },
} satisfies ToolExample<Input, Output>;
export const wardReturnedUnusedUnitCreditTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospital-pharmacy/ward-returned-unused-unit-credit",
    title: "Ward Returned Unused Unit Credit Tool",
    description:
      "Calculate ward returned unused unit credit from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        returned: { type: "integer", minimum: 0 },
        reusable: { type: "integer", minimum: 0 },
        unitCost: { type: "number", minimum: 0 },
        handlingCost: { type: "number", minimum: 0 },
      },
      required: ["returned", "reusable", "unitCost", "handlingCost"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        credit: { type: "number" },
        rejected: { type: "integer" },
        netCredit: { type: "number" },
      },
      required: ["credit", "rejected", "netCredit"],
    },
    ports: {
      inputs: [
        {
          id: "returned",
          label: "Returned",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "reusable",
          label: "Reusable",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "unitCost",
          label: "Unit Cost",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "handlingCost",
          label: "Handling Cost",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "credit", label: "Credit", valueType: { type: "number" } },
        { id: "rejected", label: "Rejected", valueType: { type: "integer" } },
        { id: "netCredit", label: "Net Credit", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = wardReturnedUnusedUnitCreditTool.execute;
export default wardReturnedUnusedUnitCreditTool;
