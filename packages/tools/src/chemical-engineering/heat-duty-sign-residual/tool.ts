import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly inletEnthalpyRate: number;
  readonly outletEnthalpyRate: number;
  readonly suppliedHeatDuty: number;
  readonly suppliedWorkIntoSystem: number;
};
export type Output = {
  readonly requiredHeatDuty: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    inletEnthalpyRate: { type: "number" },
    outletEnthalpyRate: { type: "number" },
    suppliedHeatDuty: { type: "number" },
    suppliedWorkIntoSystem: { type: "number" },
  },
  required: [
    "inletEnthalpyRate",
    "outletEnthalpyRate",
    "suppliedHeatDuty",
    "suppliedWorkIntoSystem",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requiredHeatDuty: { type: "number" },
    residual: { type: "number" },
  },
  required: ["requiredHeatDuty", "residual"],
} as const;
/** Check a supplied steady enthalpy balance with explicit work into the system; no chemical model or safety judgment. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    inletEnthalpyRate,
    outletEnthalpyRate,
    suppliedHeatDuty,
    suppliedWorkIntoSystem,
  } = request;
  const compute = (): Output => {
    return {
      requiredHeatDuty:
        outletEnthalpyRate - inletEnthalpyRate - suppliedWorkIntoSystem,
      residual:
        suppliedHeatDuty -
        (outletEnthalpyRate - inletEnthalpyRate - suppliedWorkIntoSystem),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    inletEnthalpyRate: 10,
    outletEnthalpyRate: 30,
    suppliedHeatDuty: 15,
    suppliedWorkIntoSystem: 5,
  },
  output: { requiredHeatDuty: 15, residual: 0 },
} satisfies ToolExample<Input, Output>;
export const heatDutySignResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "chemical-engineering/heat-duty-sign-residual",
    title: "Heat Duty Sign Residual Tool",
    description:
      "Check a supplied steady enthalpy balance with explicit work into the system; no chemical model or safety judgment.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        inletEnthalpyRate: { type: "number" },
        outletEnthalpyRate: { type: "number" },
        suppliedHeatDuty: { type: "number" },
        suppliedWorkIntoSystem: { type: "number" },
      },
      required: [
        "inletEnthalpyRate",
        "outletEnthalpyRate",
        "suppliedHeatDuty",
        "suppliedWorkIntoSystem",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requiredHeatDuty: { type: "number" },
        residual: { type: "number" },
      },
      required: ["requiredHeatDuty", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "inletEnthalpyRate",
          label: "Inlet Enthalpy Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "outletEnthalpyRate",
          label: "Outlet Enthalpy Rate",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedHeatDuty",
          label: "Supplied Heat Duty",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedWorkIntoSystem",
          label: "Supplied Work Into System",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "requiredHeatDuty",
          label: "Required Heat Duty",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = heatDutySignResidualTool.execute;
export default heatDutySignResidualTool;
