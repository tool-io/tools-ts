import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly opening: number;
  readonly input: number;
  readonly eliminated: number;
  readonly transferredOut: number;
  readonly transferredIn: number;
  readonly measuredClosing: number;
};
export type Output = {
  readonly expectedClosing: number;
  readonly residual: number;
  readonly totalOut: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    opening: { type: "number", minimum: 0 },
    input: { type: "number", minimum: 0 },
    eliminated: { type: "number", minimum: 0 },
    transferredOut: { type: "number", minimum: 0 },
    transferredIn: { type: "number", minimum: 0 },
    measuredClosing: { type: "number", minimum: 0 },
  },
  required: [
    "opening",
    "input",
    "eliminated",
    "transferredOut",
    "transferredIn",
    "measuredClosing",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedClosing: { type: "number" },
    residual: { type: "number" },
    totalOut: { type: "number" },
  },
  required: ["expectedClosing", "residual", "totalOut"],
} as const;
/** Calculate pk research compartment mass balance residual from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    opening,
    input,
    eliminated,
    transferredOut,
    transferredIn,
    measuredClosing,
  } = request;
  const compute = (): Output => {
    H.domain(
      opening >= 0 &&
        input >= 0 &&
        eliminated >= 0 &&
        transferredOut >= 0 &&
        transferredIn >= 0 &&
        measuredClosing >= 0,
    );
    return {
      expectedClosing:
        opening + input - eliminated - transferredOut + transferredIn,
      residual:
        measuredClosing -
        opening -
        input +
        eliminated +
        transferredOut -
        transferredIn,
      totalOut: eliminated + transferredOut,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    opening: 100,
    input: 20,
    eliminated: 30,
    transferredOut: 10,
    transferredIn: 5,
    measuredClosing: 84,
  },
  output: { expectedClosing: 85, residual: -1, totalOut: 40 },
} satisfies ToolExample<Input, Output>;
export const pkResearchCompartmentMassBalanceResidualTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "pharmacokinetics/pk-research-compartment-mass-balance-residual",
      title: "PK Research Compartment Mass Balance Residual Tool",
      description:
        "Calculate pk research compartment mass balance residual from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          opening: { type: "number", minimum: 0 },
          input: { type: "number", minimum: 0 },
          eliminated: { type: "number", minimum: 0 },
          transferredOut: { type: "number", minimum: 0 },
          transferredIn: { type: "number", minimum: 0 },
          measuredClosing: { type: "number", minimum: 0 },
        },
        required: [
          "opening",
          "input",
          "eliminated",
          "transferredOut",
          "transferredIn",
          "measuredClosing",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          expectedClosing: { type: "number" },
          residual: { type: "number" },
          totalOut: { type: "number" },
        },
        required: ["expectedClosing", "residual", "totalOut"],
      },
      ports: {
        inputs: [
          {
            id: "opening",
            label: "Opening",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "input",
            label: "Input",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "eliminated",
            label: "Eliminated",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "transferredOut",
            label: "Transferred Out",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "transferredIn",
            label: "Transferred In",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "measuredClosing",
            label: "Measured Closing",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "expectedClosing",
            label: "Expected Closing",
            valueType: { type: "number" },
          },
          { id: "residual", label: "Residual", valueType: { type: "number" } },
          { id: "totalOut", label: "Total Out", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  });
export const run = pkResearchCompartmentMassBalanceResidualTool.execute;
export default pkResearchCompartmentMassBalanceResidualTool;
