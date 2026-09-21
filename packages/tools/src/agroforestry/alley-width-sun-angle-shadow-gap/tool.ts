import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly alleyWidth: number;
  readonly treeHeight: number;
  readonly sunAltitude: number;
};
export type Output = {
  readonly shadowLength: number;
  readonly unshadowedWidth: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    alleyWidth: { type: "number", minimum: 0 },
    treeHeight: { type: "number", minimum: 0 },
    sunAltitude: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["alleyWidth", "treeHeight", "sunAltitude"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    shadowLength: { type: "number" },
    unshadowedWidth: { type: "number" },
  },
  required: ["shadowLength", "unshadowedWidth"],
} as const;
/** Calculate alley width sun angle shadow gap from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { alleyWidth, treeHeight, sunAltitude } = request;
  const compute = (): Output => {
    H.domain(
      alleyWidth >= 0 &&
        treeHeight >= 0 &&
        sunAltitude > 0 &&
        sunAltitude < Math.PI / 2,
    );
    return {
      shadowLength: treeHeight / Math.tan(sunAltitude),
      unshadowedWidth: Math.max(
        0,
        alleyWidth - treeHeight / Math.tan(sunAltitude),
      ),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { alleyWidth: 10, treeHeight: 4, sunAltitude: 0.7853981633974483 },
  output: {
    shadowLength: 4.000000000000001,
    unshadowedWidth: 5.999999999999999,
  },
} satisfies ToolExample<Input, Output>;
export const alleyWidthSunAngleShadowGapTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agroforestry/alley-width-sun-angle-shadow-gap",
    title: "Alley Width Sun Angle Shadow Gap Tool",
    description:
      "Calculate alley width sun angle shadow gap from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        alleyWidth: { type: "number", minimum: 0 },
        treeHeight: { type: "number", minimum: 0 },
        sunAltitude: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["alleyWidth", "treeHeight", "sunAltitude"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        shadowLength: { type: "number" },
        unshadowedWidth: { type: "number" },
      },
      required: ["shadowLength", "unshadowedWidth"],
    },
    ports: {
      inputs: [
        {
          id: "alleyWidth",
          label: "Alley Width",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "treeHeight",
          label: "Tree Height",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "sunAltitude",
          label: "Sun Altitude",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "shadowLength",
          label: "Shadow Length",
          valueType: { type: "number" },
        },
        {
          id: "unshadowedWidth",
          label: "Unshadowed Width",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = alleyWidthSunAngleShadowGapTool.execute;
export default alleyWidthSunAngleShadowGapTool;
