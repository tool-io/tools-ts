import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly height: number;
  readonly oldDatumElevation: number;
  readonly newDatumElevation: number;
};
export type Output = { readonly height: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    height: { type: "number" },
    oldDatumElevation: { type: "number" },
    newDatumElevation: { type: "number" },
  },
  required: ["height", "oldDatumElevation", "newDatumElevation"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { height: { type: "number" } },
  required: ["height"],
} as const;
/** Calculate tide observation reference level shift from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { height, oldDatumElevation, newDatumElevation } = request;
  const compute = (): Output => {
    return { height: height + oldDatumElevation - newDatumElevation };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { height: 3, oldDatumElevation: 2, newDatumElevation: 4 },
  output: { height: 1 },
} satisfies ToolExample<Input, Output>;
export const tideObservationReferenceLevelShiftTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "nautical/tide-observation-reference-level-shift",
    title: "Tide Observation Reference Level Shift Tool",
    description:
      "Calculate tide observation reference level shift from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        height: { type: "number" },
        oldDatumElevation: { type: "number" },
        newDatumElevation: { type: "number" },
      },
      required: ["height", "oldDatumElevation", "newDatumElevation"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { height: { type: "number" } },
      required: ["height"],
    },
    ports: {
      inputs: [
        {
          id: "height",
          label: "Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "oldDatumElevation",
          label: "Old Datum Elevation",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "newDatumElevation",
          label: "New Datum Elevation",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "height", label: "Height", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = tideObservationReferenceLevelShiftTool.execute;
export default tideObservationReferenceLevelShiftTool;
