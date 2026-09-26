import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly emissions: number;
  readonly freeAllocation: number;
  readonly permitPrice: number;
  readonly allowSale: boolean;
};
export type Output = {
  readonly netObligation: number;
  readonly netCost: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    emissions: { type: "number", minimum: 0 },
    freeAllocation: { type: "number", minimum: 0 },
    permitPrice: { type: "number" },
    allowSale: { type: "boolean" },
  },
  required: ["emissions", "freeAllocation", "permitPrice", "allowSale"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    netObligation: { type: "number" },
    netCost: { type: "number" },
  },
  required: ["netObligation", "netCost"],
} as const;
/** Calculate emissions charge free allocation gap term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { emissions, freeAllocation, permitPrice, allowSale } = request;
  const compute = (): Output => {
    H.domain(emissions >= 0 && freeAllocation >= 0);
    return {
      netObligation: allowSale
        ? emissions - freeAllocation
        : Math.max(0, emissions - freeAllocation),
      netCost:
        (allowSale
          ? emissions - freeAllocation
          : Math.max(0, emissions - freeAllocation)) * permitPrice,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    emissions: 100,
    freeAllocation: 80,
    permitPrice: 50,
    allowSale: true,
  },
  output: { netObligation: 20, netCost: 1000 },
} satisfies ToolExample<Input, Output>;
export const emissionsChargeFreeAllocationGapTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "environmental-economics/emissions-charge-free-allocation-gap-term",
      title: "Emissions Charge Free Allocation Gap Term Tool",
      description:
        "Calculate emissions charge free allocation gap term from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          emissions: { type: "number", minimum: 0 },
          freeAllocation: { type: "number", minimum: 0 },
          permitPrice: { type: "number" },
          allowSale: { type: "boolean" },
        },
        required: ["emissions", "freeAllocation", "permitPrice", "allowSale"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          netObligation: { type: "number" },
          netCost: { type: "number" },
        },
        required: ["netObligation", "netCost"],
      },
      ports: {
        inputs: [
          {
            id: "emissions",
            label: "Emissions",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "freeAllocation",
            label: "Free Allocation",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "permitPrice",
            label: "Permit Price",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "allowSale",
            label: "Allow Sale",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          {
            id: "netObligation",
            label: "Net Obligation",
            valueType: { type: "number" },
          },
          { id: "netCost", label: "Net Cost", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = emissionsChargeFreeAllocationGapTermTool.execute;
export default emissionsChargeFreeAllocationGapTermTool;
