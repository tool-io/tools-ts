import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly length: number;
  readonly travelSeconds: number;
  readonly nonPrintingSeconds: number;
};
export type Output = {
  readonly effectiveSpeed: number;
  readonly printingSpeed: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    length: { type: "number", minimum: 0 },
    travelSeconds: { type: "number" },
    nonPrintingSeconds: { type: "number", minimum: 0 },
  },
  required: ["length", "travelSeconds", "nonPrintingSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    effectiveSpeed: { type: "number" },
    printingSpeed: { type: "number" },
  },
  required: ["effectiveSpeed", "printingSpeed"],
} as const;
/** Calculate biofabrication nozzle travel speed factor from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { length, travelSeconds, nonPrintingSeconds } = request;
  const compute = (): Output => {
    H.domain(
      length >= 0 &&
        nonPrintingSeconds >= 0 &&
        travelSeconds > nonPrintingSeconds,
    );
    return {
      effectiveSpeed: length / travelSeconds,
      printingSpeed: length / (travelSeconds - nonPrintingSeconds),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { length: 100, travelSeconds: 20, nonPrintingSeconds: 5 },
  output: { effectiveSpeed: 5, printingSpeed: 6.666666666666667 },
} satisfies ToolExample<Input, Output>;
export const biofabricationNozzleTravelSpeedFactorTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "biofabrication/biofabrication-nozzle-travel-speed-factor",
      title: "Biofabrication Nozzle Travel Speed Factor Tool",
      description:
        "Calculate biofabrication nozzle travel speed factor from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          length: { type: "number", minimum: 0 },
          travelSeconds: { type: "number" },
          nonPrintingSeconds: { type: "number", minimum: 0 },
        },
        required: ["length", "travelSeconds", "nonPrintingSeconds"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          effectiveSpeed: { type: "number" },
          printingSpeed: { type: "number" },
        },
        required: ["effectiveSpeed", "printingSpeed"],
      },
      ports: {
        inputs: [
          {
            id: "length",
            label: "Length",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "travelSeconds",
            label: "Travel Seconds",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "nonPrintingSeconds",
            label: "Non Printing Seconds",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "effectiveSpeed",
            label: "Effective Speed",
            valueType: { type: "number" },
          },
          {
            id: "printingSpeed",
            label: "Printing Speed",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = biofabricationNozzleTravelSpeedFactorTool.execute;
export default biofabricationNozzleTravelSpeedFactorTool;
