import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly instrument: number;
  readonly instrumentMean: number;
  readonly residual: number;
};
export type Output = {
  readonly uncenteredMoment: number;
  readonly centeredMoment: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    instrument: { type: "number" },
    instrumentMean: { type: "number" },
    residual: { type: "number" },
  },
  required: ["instrument", "instrumentMean", "residual"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    uncenteredMoment: { type: "number" },
    centeredMoment: { type: "number" },
  },
  required: ["uncenteredMoment", "centeredMoment"],
} as const;
/** Calculate instrument moment centering residual from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { instrument, instrumentMean, residual } = request;
  const compute = (): Output => {
    return {
      uncenteredMoment: instrument * residual,
      centeredMoment: (instrument - instrumentMean) * residual,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { instrument: 5, instrumentMean: 3, residual: 2 },
  output: { uncenteredMoment: 10, centeredMoment: 4 },
} satisfies ToolExample<Input, Output>;
export const instrumentMomentCenteringResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "econometrics/instrument-moment-centering-residual",
    title: "Instrument Moment Centering Residual Tool",
    description:
      "Calculate instrument moment centering residual from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        instrument: { type: "number" },
        instrumentMean: { type: "number" },
        residual: { type: "number" },
      },
      required: ["instrument", "instrumentMean", "residual"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        uncenteredMoment: { type: "number" },
        centeredMoment: { type: "number" },
      },
      required: ["uncenteredMoment", "centeredMoment"],
    },
    ports: {
      inputs: [
        {
          id: "instrument",
          label: "Instrument",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "instrumentMean",
          label: "Instrument Mean",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "residual",
          label: "Residual",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "uncenteredMoment",
          label: "Uncentered Moment",
          valueType: { type: "number" },
        },
        {
          id: "centeredMoment",
          label: "Centered Moment",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = instrumentMomentCenteringResidualTool.execute;
export default instrumentMomentCenteringResidualTool;
