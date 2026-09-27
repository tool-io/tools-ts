import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly fillVolume: number;
  readonly packageVolume: number;
};
export type Output = {
  readonly headspace: number;
  readonly headspaceShare: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    fillVolume: { type: "number", minimum: 0 },
    packageVolume: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["fillVolume", "packageVolume"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    headspace: { type: "number" },
    headspaceShare: { type: "number" },
  },
  required: ["headspace", "headspaceShare"],
} as const;
/** Calculate package fill headspace share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { fillVolume, packageVolume } = request;
  const compute = (): Output => {
    H.positive(packageVolume);
    H.domain(fillVolume >= 0 && fillVolume <= packageVolume);
    return {
      headspace: packageVolume - fillVolume,
      headspaceShare: (packageVolume - fillVolume) / packageVolume,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { fillVolume: 8, packageVolume: 10 },
  output: { headspace: 2, headspaceShare: 0.2 },
} satisfies ToolExample<Input, Output>;
export const packageFillHeadspaceShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-technology/package-fill-headspace-share",
    title: "Package Fill Headspace Share Tool",
    description:
      "Calculate package fill headspace share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        fillVolume: { type: "number", minimum: 0 },
        packageVolume: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["fillVolume", "packageVolume"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        headspace: { type: "number" },
        headspaceShare: { type: "number" },
      },
      required: ["headspace", "headspaceShare"],
    },
    ports: {
      inputs: [
        {
          id: "fillVolume",
          label: "Fill Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "packageVolume",
          label: "Package Volume",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "headspace", label: "Headspace", valueType: { type: "number" } },
        {
          id: "headspaceShare",
          label: "Headspace Share",
          valueType: { type: "number" },
        },
      ],
    },
  },
  calculate,
});
export const run = packageFillHeadspaceShareTool.execute;
export default packageFillHeadspaceShareTool;
