import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly zenithAngleRadians: number;
  readonly solidAngleSteradians: number;
};
export type Output = { readonly projectedSolidAngleWeight: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    zenithAngleRadians: { type: "number", minimum: 0 },
    solidAngleSteradians: { type: "number", minimum: 0 },
  },
  required: ["zenithAngleRadians", "solidAngleSteradians"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { projectedSolidAngleWeight: { type: "number" } },
  required: ["projectedSolidAngleWeight"],
} as const;
/** Return one cosine-projected solid-angle contribution from an upper-hemisphere sky patch, without normalizing a complete sky-view integral. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { zenithAngleRadians, solidAngleSteradians } = request;
  const compute = (): Output => {
    H.domain(
      zenithAngleRadians >= 0 &&
        zenithAngleRadians <= Math.PI / 2 &&
        solidAngleSteradians >= 0,
      "zenithAngleRadians",
    );
    return {
      projectedSolidAngleWeight:
        Math.cos(zenithAngleRadians) * solidAngleSteradians,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { zenithAngleRadians: 0, solidAngleSteradians: 0.2 },
  output: { projectedSolidAngleWeight: 0.2 },
} satisfies ToolExample<Input, Output>;
export const skyViewZenithAngleWeightTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["data", "learn"],
      fields: ["atmospheric-physics", "atmospheric physics", "physics"],
      keywords: ["atmospheric physics", "physics"],
    },
    id: "atmospheric-physics/sky-view-zenith-angle-weight",
    title: "Sky View Zenith Angle Weight",
    description:
      "Return one cosine-projected solid-angle contribution from an upper-hemisphere sky patch, without normalizing a complete sky-view integral.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        zenithAngleRadians: { type: "number", minimum: 0 },
        solidAngleSteradians: { type: "number", minimum: 0 },
      },
      required: ["zenithAngleRadians", "solidAngleSteradians"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { projectedSolidAngleWeight: { type: "number" } },
      required: ["projectedSolidAngleWeight"],
    },
    ports: {
      inputs: [
        {
          id: "zenithAngleRadians",
          label: "Zenith Angle Radians",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "solidAngleSteradians",
          label: "Solid Angle Steradians",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "projectedSolidAngleWeight",
          label: "Projected Solid Angle Weight",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = skyViewZenithAngleWeightTool.execute;
export default skyViewZenithAngleWeightTool;
