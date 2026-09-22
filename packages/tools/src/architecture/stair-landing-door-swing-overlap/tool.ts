import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly landingArea: number;
  readonly swingArea: number;
  readonly overlapArea: number;
  readonly excludedArea: number;
};
export type Output = { readonly clearArea: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    landingArea: { type: "number", minimum: 0 },
    swingArea: { type: "number", minimum: 0 },
    overlapArea: { type: "number", minimum: 0 },
    excludedArea: { type: "number", minimum: 0 },
  },
  required: ["landingArea", "swingArea", "overlapArea", "excludedArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { clearArea: { type: "number" } },
  required: ["clearArea"],
} as const;
/** Area accounting from a supplied swing/landing intersection; no door-clearance rule is selected. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { landingArea, swingArea, overlapArea, excludedArea } = request;
  const compute = (): Output => {
    H.domain(
      landingArea >= 0 &&
        swingArea >= 0 &&
        overlapArea >= 0 &&
        overlapArea <= Math.min(landingArea, swingArea) &&
        excludedArea >= 0 &&
        overlapArea + excludedArea <= landingArea,
    );
    return { clearArea: landingArea - overlapArea - excludedArea };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { landingArea: 10, swingArea: 3, overlapArea: 2, excludedArea: 1 },
  output: { clearArea: 7 },
} satisfies ToolExample<Input, Output>;
export const stairLandingDoorSwingOverlapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "architecture/stair-landing-door-swing-overlap",
    title: "Stair Landing Door Swing Overlap Tool",
    description:
      "Area accounting from a supplied swing/landing intersection; no door-clearance rule is selected.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        landingArea: { type: "number", minimum: 0 },
        swingArea: { type: "number", minimum: 0 },
        overlapArea: { type: "number", minimum: 0 },
        excludedArea: { type: "number", minimum: 0 },
      },
      required: ["landingArea", "swingArea", "overlapArea", "excludedArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { clearArea: { type: "number" } },
      required: ["clearArea"],
    },
    ports: {
      inputs: [
        {
          id: "landingArea",
          label: "Landing Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "swingArea",
          label: "Swing Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "overlapArea",
          label: "Overlap Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "excludedArea",
          label: "Excluded Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "clearArea", label: "Clear Area", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = stairLandingDoorSwingOverlapTool.execute;
export default stairLandingDoorSwingOverlapTool;
