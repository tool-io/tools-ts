import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly headDiameter: number;
  readonly toolClearance: number;
};
export type Output = { readonly requiredAccessRadius: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    headDiameter: { type: "number", minimum: 0 },
    toolClearance: { type: "number", minimum: 0 },
  },
  required: ["headDiameter", "toolClearance"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { requiredAccessRadius: { type: "number" } },
  required: ["requiredAccessRadius"],
} as const;
/** Add radial tool clearance around a circular screw head to obtain a required cylindrical access radius. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { headDiameter, toolClearance } = request;
  const compute = (): Output => {
    H.domain(headDiameter >= 0 && toolClearance >= 0, "headDiameter");
    return { requiredAccessRadius: headDiameter / 2 + toolClearance };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { headDiameter: 8, toolClearance: 3 },
  output: { requiredAccessRadius: 7 },
} satisfies ToolExample<Input, Output>;
export const screwHeadToolAccessRadiusTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "industrial-design/screw-head-tool-access-radius",
    title: "Screw Head Tool Access Radius Tool",
    description:
      "Add radial tool clearance around a circular screw head to obtain a required cylindrical access radius.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        headDiameter: { type: "number", minimum: 0 },
        toolClearance: { type: "number", minimum: 0 },
      },
      required: ["headDiameter", "toolClearance"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { requiredAccessRadius: { type: "number" } },
      required: ["requiredAccessRadius"],
    },
    ports: {
      inputs: [
        {
          id: "headDiameter",
          label: "Head Diameter",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "toolClearance",
          label: "Tool Clearance",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "requiredAccessRadius",
          label: "Required Access Radius",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = screwHeadToolAccessRadiusTool.execute;
export default screwHeadToolAccessRadiusTool;
