import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly recorded: number;
  readonly suppliedInstrumentZero: number;
  readonly suppliedAxisSign: number;
  readonly reference: number;
};
export type Output = { readonly corrected: number; readonly residual: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    recorded: { type: "number" },
    suppliedInstrumentZero: { type: "number" },
    suppliedAxisSign: { type: "integer" },
    reference: { type: "number" },
  },
  required: [
    "recorded",
    "suppliedInstrumentZero",
    "suppliedAxisSign",
    "reference",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { corrected: { type: "number" }, residual: { type: "number" } },
  required: ["corrected", "residual"],
} as const;
/** Compare supplied research motion measurements under explicit instrument/sign conventions; no manipulation or efficacy claim. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { recorded, suppliedInstrumentZero, suppliedAxisSign, reference } =
    request;
  const compute = (): Output => {
    H.domain([1, -1].includes(suppliedAxisSign));
    return {
      corrected: (recorded - suppliedInstrumentZero) * suppliedAxisSign,
      residual:
        (recorded - suppliedInstrumentZero) * suppliedAxisSign - reference,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    recorded: 12,
    suppliedInstrumentZero: 2,
    suppliedAxisSign: -1,
    reference: -8,
  },
  output: { corrected: -10, residual: -2 },
} satisfies ToolExample<Input, Output>;
export const researchMotionMeasurementOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "chiropractic/research-motion-measurement-offset",
    title: "Research Motion Measurement Offset Tool",
    description:
      "Compare supplied research motion measurements under explicit instrument/sign conventions; no manipulation or efficacy claim.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        recorded: { type: "number" },
        suppliedInstrumentZero: { type: "number" },
        suppliedAxisSign: { type: "integer" },
        reference: { type: "number" },
      },
      required: [
        "recorded",
        "suppliedInstrumentZero",
        "suppliedAxisSign",
        "reference",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        corrected: { type: "number" },
        residual: { type: "number" },
      },
      required: ["corrected", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "recorded",
          label: "Recorded",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedInstrumentZero",
          label: "Supplied Instrument Zero",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedAxisSign",
          label: "Supplied Axis Sign",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "reference",
          label: "Reference",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "corrected", label: "Corrected", valueType: { type: "number" } },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = researchMotionMeasurementOffsetTool.execute;
export default researchMotionMeasurementOffsetTool;
