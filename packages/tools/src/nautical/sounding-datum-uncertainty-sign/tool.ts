import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly measuredDepth: number;
  readonly tideAboveDatum: number;
  readonly depthUncertainty: number;
  readonly tideUncertainty: number;
  readonly independent: boolean;
};
export type Output = {
  readonly datumDepth: number;
  readonly combinedUncertainty: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    measuredDepth: { type: "number" },
    tideAboveDatum: { type: "number" },
    depthUncertainty: { type: "number", minimum: 0 },
    tideUncertainty: { type: "number", minimum: 0 },
    independent: { type: "boolean" },
  },
  required: [
    "measuredDepth",
    "tideAboveDatum",
    "depthUncertainty",
    "tideUncertainty",
    "independent",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    datumDepth: { type: "number" },
    combinedUncertainty: { type: "number" },
  },
  required: ["datumDepth", "combinedUncertainty"],
} as const;
/** Subtract tide above datum and combine supplied uncertainty as independent RSS or a worst-case sum. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    measuredDepth,
    tideAboveDatum,
    depthUncertainty,
    tideUncertainty,
    independent,
  } = request;
  const compute = (): Output => {
    H.domain(depthUncertainty >= 0 && tideUncertainty >= 0);
    return {
      datumDepth: measuredDepth - tideAboveDatum,
      combinedUncertainty: independent
        ? Math.hypot(depthUncertainty, tideUncertainty)
        : depthUncertainty + tideUncertainty,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    measuredDepth: 10,
    tideAboveDatum: 2,
    depthUncertainty: 3,
    tideUncertainty: 4,
    independent: true,
  },
  output: { datumDepth: 8, combinedUncertainty: 5 },
} satisfies ToolExample<Input, Output>;
export const soundingDatumUncertaintySignTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nautical/sounding-datum-uncertainty-sign",
    title: "Sounding Datum Uncertainty Sign Tool",
    description:
      "Subtract tide above datum and combine supplied uncertainty as independent RSS or a worst-case sum.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        measuredDepth: { type: "number" },
        tideAboveDatum: { type: "number" },
        depthUncertainty: { type: "number", minimum: 0 },
        tideUncertainty: { type: "number", minimum: 0 },
        independent: { type: "boolean" },
      },
      required: [
        "measuredDepth",
        "tideAboveDatum",
        "depthUncertainty",
        "tideUncertainty",
        "independent",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        datumDepth: { type: "number" },
        combinedUncertainty: { type: "number" },
      },
      required: ["datumDepth", "combinedUncertainty"],
    },
    ports: {
      inputs: [
        {
          id: "measuredDepth",
          label: "Measured Depth",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tideAboveDatum",
          label: "Tide Above Datum",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "depthUncertainty",
          label: "Depth Uncertainty",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "tideUncertainty",
          label: "Tide Uncertainty",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "independent",
          label: "Independent",
          required: true,
          valueType: { type: "boolean" },
        },
      ],
      outputs: [
        {
          id: "datumDepth",
          label: "Datum Depth",
          valueType: { type: "number" },
        },
        {
          id: "combinedUncertainty",
          label: "Combined Uncertainty",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = soundingDatumUncertaintySignTool.execute;
export default soundingDatumUncertaintySignTool;
