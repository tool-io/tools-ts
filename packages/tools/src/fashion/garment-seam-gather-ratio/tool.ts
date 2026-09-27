import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly ungatheredLength: number;
  readonly finishedLength: number;
  readonly seamAllowanceEachEnd: number;
};
export type Output = {
  readonly usableUngathered: number;
  readonly usableFinished: number;
  readonly gatherRatio: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    ungatheredLength: { type: "number" },
    finishedLength: { type: "number" },
    seamAllowanceEachEnd: { type: "number", minimum: 0 },
  },
  required: ["ungatheredLength", "finishedLength", "seamAllowanceEachEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    usableUngathered: { type: "number" },
    usableFinished: { type: "number" },
    gatherRatio: { type: "number" },
  },
  required: ["usableUngathered", "usableFinished", "gatherRatio"],
} as const;
/** Calculate garment seam gather ratio from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { ungatheredLength, finishedLength, seamAllowanceEachEnd } = request;
  const compute = (): Output => {
    H.domain(
      seamAllowanceEachEnd >= 0 &&
        ungatheredLength >= 2 * seamAllowanceEachEnd &&
        finishedLength > 2 * seamAllowanceEachEnd,
    );
    return {
      usableUngathered: ungatheredLength - 2 * seamAllowanceEachEnd,
      usableFinished: finishedLength - 2 * seamAllowanceEachEnd,
      gatherRatio:
        (ungatheredLength - 2 * seamAllowanceEachEnd) /
        (finishedLength - 2 * seamAllowanceEachEnd),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { ungatheredLength: 104, finishedLength: 54, seamAllowanceEachEnd: 2 },
  output: { usableUngathered: 100, usableFinished: 50, gatherRatio: 2 },
} satisfies ToolExample<Input, Output>;
export const garmentSeamGatherRatioTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "fashion/garment-seam-gather-ratio",
    title: "Garment Seam Gather Ratio Tool",
    description:
      "Calculate garment seam gather ratio from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        ungatheredLength: { type: "number" },
        finishedLength: { type: "number" },
        seamAllowanceEachEnd: { type: "number", minimum: 0 },
      },
      required: ["ungatheredLength", "finishedLength", "seamAllowanceEachEnd"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        usableUngathered: { type: "number" },
        usableFinished: { type: "number" },
        gatherRatio: { type: "number" },
      },
      required: ["usableUngathered", "usableFinished", "gatherRatio"],
    },
    ports: {
      inputs: [
        {
          id: "ungatheredLength",
          label: "Ungathered Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "finishedLength",
          label: "Finished Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "seamAllowanceEachEnd",
          label: "Seam Allowance Each End",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "usableUngathered",
          label: "Usable Ungathered",
          valueType: { type: "number" },
        },
        {
          id: "usableFinished",
          label: "Usable Finished",
          valueType: { type: "number" },
        },
        {
          id: "gatherRatio",
          label: "Gather Ratio",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = garmentSeamGatherRatioTool.execute;
export default garmentSeamGatherRatioTool;
