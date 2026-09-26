import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly nominal: number;
  readonly measured: number;
  readonly lowerTolerance: number;
  readonly upperTolerance: number;
};
export type Output = {
  readonly deviation: number;
  readonly lowerMargin: number;
  readonly upperMargin: number;
  readonly within: boolean;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    nominal: { type: "number", minimum: 0 },
    measured: { type: "number", minimum: 0 },
    lowerTolerance: { type: "number", minimum: 0 },
    upperTolerance: { type: "number", minimum: 0 },
  },
  required: ["nominal", "measured", "lowerTolerance", "upperTolerance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    deviation: { type: "number" },
    lowerMargin: { type: "number" },
    upperMargin: { type: "number" },
    within: { type: "boolean" },
  },
  required: ["deviation", "lowerMargin", "upperMargin", "within"],
} as const;
/** Calculate endodontic bench instrument length tolerance gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { nominal, measured, lowerTolerance, upperTolerance } = request;
  const compute = (): Output => {
    H.domain(
      nominal >= 0 &&
        measured >= 0 &&
        lowerTolerance >= 0 &&
        upperTolerance >= 0,
    );
    return {
      deviation: measured - nominal,
      lowerMargin: measured - nominal + lowerTolerance,
      upperMargin: nominal + upperTolerance - measured,
      within:
        measured >= nominal - lowerTolerance &&
        measured <= nominal + upperTolerance,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    nominal: 25,
    measured: 24.8,
    lowerTolerance: 0.3,
    upperTolerance: 0.2,
  },
  output: {
    deviation: -0.1999999999999993,
    lowerMargin: 0.1000000000000007,
    upperMargin: 0.3999999999999986,
    within: true,
  },
} satisfies ToolExample<Input, Output>;
export const endodonticBenchInstrumentLengthToleranceGapTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "endodontics/endodontic-bench-instrument-length-tolerance-gap",
      title: "Endodontic Bench Instrument Length Tolerance Gap Tool",
      description:
        "Calculate endodontic bench instrument length tolerance gap from explicit caller-supplied inputs.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          nominal: { type: "number", minimum: 0 },
          measured: { type: "number", minimum: 0 },
          lowerTolerance: { type: "number", minimum: 0 },
          upperTolerance: { type: "number", minimum: 0 },
        },
        required: ["nominal", "measured", "lowerTolerance", "upperTolerance"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          deviation: { type: "number" },
          lowerMargin: { type: "number" },
          upperMargin: { type: "number" },
          within: { type: "boolean" },
        },
        required: ["deviation", "lowerMargin", "upperMargin", "within"],
      },
      ports: {
        inputs: [
          {
            id: "nominal",
            label: "Nominal",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "measured",
            label: "Measured",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "lowerTolerance",
            label: "Lower Tolerance",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "upperTolerance",
            label: "Upper Tolerance",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "deviation",
            label: "Deviation",
            valueType: { type: "number" },
          },
          {
            id: "lowerMargin",
            label: "Lower Margin",
            valueType: { type: "number" },
          },
          {
            id: "upperMargin",
            label: "Upper Margin",
            valueType: { type: "number" },
          },
          { id: "within", label: "Within", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = endodonticBenchInstrumentLengthToleranceGapTool.execute;
export default endodonticBenchInstrumentLengthToleranceGapTool;
