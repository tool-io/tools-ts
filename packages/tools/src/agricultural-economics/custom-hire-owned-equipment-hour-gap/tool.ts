import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ownedFixedAnnual: number;
  readonly ownedVariablePerHour: number;
  readonly hirePerHour: number;
  readonly hours: number;
};
export type Output = {
  readonly ownedCost: number;
  readonly hireCost: number;
  readonly hireAdvantage: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ownedFixedAnnual: { type: "number", minimum: 0 },
    ownedVariablePerHour: { type: "number", minimum: 0 },
    hirePerHour: { type: "number", minimum: 0 },
    hours: { type: "number", minimum: 0 },
  },
  required: [
    "ownedFixedAnnual",
    "ownedVariablePerHour",
    "hirePerHour",
    "hours",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ownedCost: { type: "number" },
    hireCost: { type: "number" },
    hireAdvantage: { type: "number" },
  },
  required: ["ownedCost", "hireCost", "hireAdvantage"],
} as const;
/** Calculate custom hire owned equipment hour gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ownedFixedAnnual, ownedVariablePerHour, hirePerHour, hours } =
    request;
  const compute = (): Output => {
    H.domain(
      ownedFixedAnnual >= 0 &&
        ownedVariablePerHour >= 0 &&
        hirePerHour >= 0 &&
        hours >= 0,
    );
    return {
      ownedCost: ownedFixedAnnual + ownedVariablePerHour * hours,
      hireCost: hirePerHour * hours,
      hireAdvantage:
        ownedFixedAnnual + (ownedVariablePerHour - hirePerHour) * hours,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    ownedFixedAnnual: 1000,
    ownedVariablePerHour: 20,
    hirePerHour: 50,
    hours: 20,
  },
  output: { ownedCost: 1400, hireCost: 1000, hireAdvantage: 400 },
} satisfies ToolExample<Input, Output>;
export const customHireOwnedEquipmentHourGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-economics/custom-hire-owned-equipment-hour-gap",
    title: "Custom Hire Owned Equipment Hour Gap Tool",
    description:
      "Calculate custom hire owned equipment hour gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ownedFixedAnnual: { type: "number", minimum: 0 },
        ownedVariablePerHour: { type: "number", minimum: 0 },
        hirePerHour: { type: "number", minimum: 0 },
        hours: { type: "number", minimum: 0 },
      },
      required: [
        "ownedFixedAnnual",
        "ownedVariablePerHour",
        "hirePerHour",
        "hours",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ownedCost: { type: "number" },
        hireCost: { type: "number" },
        hireAdvantage: { type: "number" },
      },
      required: ["ownedCost", "hireCost", "hireAdvantage"],
    },
    ports: {
      inputs: [
        {
          id: "ownedFixedAnnual",
          label: "Owned Fixed Annual",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "ownedVariablePerHour",
          label: "Owned Variable Per Hour",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "hirePerHour",
          label: "Hire Per Hour",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "hours",
          label: "Hours",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "ownedCost", label: "Owned Cost", valueType: { type: "number" } },
        { id: "hireCost", label: "Hire Cost", valueType: { type: "number" } },
        {
          id: "hireAdvantage",
          label: "Hire Advantage",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = customHireOwnedEquipmentHourGapTool.execute;
export default customHireOwnedEquipmentHourGapTool;
