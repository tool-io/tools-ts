import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly idleHours: number;
  readonly hourlyHire: number;
  readonly creditFraction: number;
  readonly fixedCharge: number;
  readonly includeFixed: boolean;
};
export type Output = {
  readonly gross: number;
  readonly credit: number;
  readonly net: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    idleHours: { type: "number", minimum: 0 },
    hourlyHire: { type: "number", minimum: 0 },
    creditFraction: { type: "number", minimum: 0, maximum: 1 },
    fixedCharge: { type: "number", minimum: 0 },
    includeFixed: { type: "boolean" },
  },
  required: [
    "idleHours",
    "hourlyHire",
    "creditFraction",
    "fixedCharge",
    "includeFixed",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    gross: { type: "number" },
    credit: { type: "number" },
    net: { type: "number" },
  },
  required: ["gross", "credit", "net"],
} as const;
/** Calculate plant idle credit base from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { idleHours, hourlyHire, creditFraction, fixedCharge, includeFixed } =
    request;
  const compute = (): Output => {
    H.domain(idleHours >= 0 && hourlyHire >= 0 && fixedCharge >= 0);
    H.probability(creditFraction);
    return {
      gross: idleHours * hourlyHire + fixedCharge,
      credit:
        (idleHours * hourlyHire + (includeFixed ? fixedCharge : 0)) *
        creditFraction,
      net:
        idleHours * hourlyHire +
        fixedCharge -
        (idleHours * hourlyHire + (includeFixed ? fixedCharge : 0)) *
          creditFraction,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    idleHours: 10,
    hourlyHire: 20,
    creditFraction: 0.5,
    fixedCharge: 100,
    includeFixed: false,
  },
  output: { gross: 300, credit: 100, net: 200 },
} satisfies ToolExample<Input, Output>;
export const plantIdleCreditBaseTool = H.defineSchemaCalculation<Input, Output>(
  {
    ...{
      id: "construction-management/plant-idle-credit-base",
      title: "Plant Idle Credit Base Tool",
      description:
        "Calculate plant idle credit base from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          idleHours: { type: "number", minimum: 0 },
          hourlyHire: { type: "number", minimum: 0 },
          creditFraction: { type: "number", minimum: 0, maximum: 1 },
          fixedCharge: { type: "number", minimum: 0 },
          includeFixed: { type: "boolean" },
        },
        required: [
          "idleHours",
          "hourlyHire",
          "creditFraction",
          "fixedCharge",
          "includeFixed",
        ],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          gross: { type: "number" },
          credit: { type: "number" },
          net: { type: "number" },
        },
        required: ["gross", "credit", "net"],
      },
      ports: {
        inputs: [
          {
            id: "idleHours",
            label: "Idle Hours",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "hourlyHire",
            label: "Hourly Hire",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "creditFraction",
            label: "Credit Fraction",
            required: true,
            valueType: { type: "number", unit: "1" },
          },
          {
            id: "fixedCharge",
            label: "Fixed Charge",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "includeFixed",
            label: "Include Fixed",
            required: true,
            valueType: { type: "boolean" },
          },
        ],
        outputs: [
          { id: "gross", label: "Gross", valueType: { type: "number" } },
          { id: "credit", label: "Credit", valueType: { type: "number" } },
          { id: "net", label: "Net", valueType: { type: "number" } },
        ],
      },
    },
    calculate,
  },
);
export const run = plantIdleCreditBaseTool.execute;
export default plantIdleCreditBaseTool;
