import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly openingVolume: number;
  readonly closingVolume: number;
  readonly servedPours: number;
  readonly pourVolume: number;
};
export type Output = {
  readonly depletion: number;
  readonly measuredLoss: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    openingVolume: { type: "number" },
    closingVolume: { type: "number", minimum: 0 },
    servedPours: { type: "integer", minimum: 0 },
    pourVolume: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["openingVolume", "closingVolume", "servedPours", "pourVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    depletion: { type: "number" },
    measuredLoss: { type: "number" },
  },
  required: ["depletion", "measuredLoss"],
} as const;
/** Allow signed unexplained loss so over-recorded pours remain visible. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { openingVolume, closingVolume, servedPours, pourVolume } = request;
  const compute = (): Output => {
    H.domain(
      openingVolume >= closingVolume && closingVolume >= 0 && pourVolume > 0,
    );
    H.integer(servedPours, 0);
    return {
      depletion: openingVolume - closingVolume,
      measuredLoss: openingVolume - closingVolume - servedPours * pourVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    openingVolume: 1000,
    closingVolume: 200,
    servedPours: 18,
    pourVolume: 40,
  },
  output: { depletion: 800, measuredLoss: 80 },
} satisfies ToolExample<Input, Output>;
export const barSpiritYieldMeasuredLossTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "hospitality/bar-spirit-yield-measured-loss",
    title: "Bar Spirit Yield Measured Loss Tool",
    description:
      "Allow signed unexplained loss so over-recorded pours remain visible.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        openingVolume: { type: "number" },
        closingVolume: { type: "number", minimum: 0 },
        servedPours: { type: "integer", minimum: 0 },
        pourVolume: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["openingVolume", "closingVolume", "servedPours", "pourVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        depletion: { type: "number" },
        measuredLoss: { type: "number" },
      },
      required: ["depletion", "measuredLoss"],
    },
    ports: {
      inputs: [
        {
          id: "openingVolume",
          label: "Opening Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "closingVolume",
          label: "Closing Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "servedPours",
          label: "Served Pours",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "pourVolume",
          label: "Pour Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "depletion", label: "Depletion", valueType: { type: "number" } },
        {
          id: "measuredLoss",
          label: "Measured Loss",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = barSpiritYieldMeasuredLossTool.execute;
export default barSpiritYieldMeasuredLossTool;
