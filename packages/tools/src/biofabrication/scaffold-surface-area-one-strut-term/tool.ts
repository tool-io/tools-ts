import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly radius: number;
  readonly length: number;
  readonly includedEnds: number;
  readonly sharedSurface: number;
};
export type Output = {
  readonly grossSurface: number;
  readonly exposedSurface: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    radius: { type: "number", minimum: 0 },
    length: { type: "number", minimum: 0 },
    includedEnds: { type: "integer", minimum: 0, maximum: 2 },
    sharedSurface: { type: "number", minimum: 0 },
  },
  required: ["radius", "length", "includedEnds", "sharedSurface"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    grossSurface: { type: "number" },
    exposedSurface: { type: "number" },
  },
  required: ["grossSurface", "exposedSurface"],
} as const;
/** Calculate scaffold surface area one strut term from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { radius, length, includedEnds, sharedSurface } = request;
  const compute = (): Output => {
    H.domain(radius >= 0 && length >= 0 && sharedSurface >= 0);
    H.integer(includedEnds, 0, 2);
    return {
      grossSurface:
        2 * Math.PI * radius * length + includedEnds * Math.PI * radius ** 2,
      exposedSurface:
        2 * Math.PI * radius * length +
        includedEnds * Math.PI * radius ** 2 -
        sharedSurface,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { radius: 1, length: 5, includedEnds: 2, sharedSurface: 2 },
  output: {
    grossSurface: 37.69911184307752,
    exposedSurface: 35.69911184307752,
  },
} satisfies ToolExample<Input, Output>;
export const scaffoldSurfaceAreaOneStrutTermTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biofabrication/scaffold-surface-area-one-strut-term",
    title: "Scaffold Surface Area One Strut Term Tool",
    description:
      "Calculate scaffold surface area one strut term from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        radius: { type: "number", minimum: 0 },
        length: { type: "number", minimum: 0 },
        includedEnds: { type: "integer", minimum: 0, maximum: 2 },
        sharedSurface: { type: "number", minimum: 0 },
      },
      required: ["radius", "length", "includedEnds", "sharedSurface"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        grossSurface: { type: "number" },
        exposedSurface: { type: "number" },
      },
      required: ["grossSurface", "exposedSurface"],
    },
    ports: {
      inputs: [
        {
          id: "radius",
          label: "Radius",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "length",
          label: "Length",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "includedEnds",
          label: "Included Ends",
          required: true,
          valueType: { type: "integer" },
        },
        {
          id: "sharedSurface",
          label: "Shared Surface",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "grossSurface",
          label: "Gross Surface",
          valueType: { type: "number" },
        },
        {
          id: "exposedSurface",
          label: "Exposed Surface",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = scaffoldSurfaceAreaOneStrutTermTool.execute;
export default scaffoldSurfaceAreaOneStrutTermTool;
