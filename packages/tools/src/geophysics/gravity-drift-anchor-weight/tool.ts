import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly time: number;
  readonly firstTime: number;
  readonly lastTime: number;
  readonly firstDrift: number;
  readonly lastDrift: number;
  readonly observed: number;
};
export type Output = {
  readonly anchorWeight: number;
  readonly interpolatedDrift: number;
  readonly corrected: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    time: { type: "number" },
    firstTime: { type: "number" },
    lastTime: { type: "number" },
    firstDrift: { type: "number" },
    lastDrift: { type: "number" },
    observed: { type: "number" },
  },
  required: [
    "time",
    "firstTime",
    "lastTime",
    "firstDrift",
    "lastDrift",
    "observed",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    anchorWeight: { type: "number" },
    interpolatedDrift: { type: "number" },
    corrected: { type: "number" },
  },
  required: ["anchorWeight", "interpolatedDrift", "corrected"],
} as const;
/** Calculate gravity drift anchor weight from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { time, firstTime, lastTime, firstDrift, lastDrift, observed } =
    request;
  const compute = (): Output => {
    H.domain(lastTime > firstTime && time >= firstTime && time <= lastTime);
    return {
      anchorWeight: (time - firstTime) / (lastTime - firstTime),
      interpolatedDrift:
        firstDrift +
        ((lastDrift - firstDrift) * (time - firstTime)) /
          (lastTime - firstTime),
      corrected:
        observed -
        firstDrift -
        ((lastDrift - firstDrift) * (time - firstTime)) /
          (lastTime - firstTime),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    time: 5,
    firstTime: 0,
    lastTime: 10,
    firstDrift: 2,
    lastDrift: 4,
    observed: 20,
  },
  output: { anchorWeight: 0.5, interpolatedDrift: 3, corrected: 17 },
} satisfies ToolExample<Input, Output>;
export const gravityDriftAnchorWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "geophysics/gravity-drift-anchor-weight",
    title: "Gravity Drift Anchor Weight Tool",
    description:
      "Calculate gravity drift anchor weight from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        time: { type: "number" },
        firstTime: { type: "number" },
        lastTime: { type: "number" },
        firstDrift: { type: "number" },
        lastDrift: { type: "number" },
        observed: { type: "number" },
      },
      required: [
        "time",
        "firstTime",
        "lastTime",
        "firstDrift",
        "lastDrift",
        "observed",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        anchorWeight: { type: "number" },
        interpolatedDrift: { type: "number" },
        corrected: { type: "number" },
      },
      required: ["anchorWeight", "interpolatedDrift", "corrected"],
    },
    ports: {
      inputs: [
        {
          id: "time",
          label: "Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstTime",
          label: "First Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lastTime",
          label: "Last Time",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "firstDrift",
          label: "First Drift",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "lastDrift",
          label: "Last Drift",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "observed",
          label: "Observed",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "anchorWeight",
          label: "Anchor Weight",
          valueType: { type: "number" },
        },
        {
          id: "interpolatedDrift",
          label: "Interpolated Drift",
          valueType: { type: "number" },
        },
        { id: "corrected", label: "Corrected", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = gravityDriftAnchorWeightTool.execute;
export default gravityDriftAnchorWeightTool;
