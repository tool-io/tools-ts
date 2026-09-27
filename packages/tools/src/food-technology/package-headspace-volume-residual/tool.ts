import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly packageVolume: number;
  readonly contentsVolume: number;
  readonly measuredHeadspace: number;
  readonly suppliedDisplacement: number;
};
export type Output = {
  readonly expectedHeadspace: number;
  readonly residual: number;
};
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    packageVolume: { type: "number" },
    contentsVolume: { type: "number" },
    measuredHeadspace: { type: "number" },
    suppliedDisplacement: { type: "number" },
  },
  required: [
    "packageVolume",
    "contentsVolume",
    "measuredHeadspace",
    "suppliedDisplacement",
  ],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    expectedHeadspace: { type: "number" },
    residual: { type: "number" },
  },
  required: ["expectedHeadspace", "residual"],
} as const;
/** Calculate package headspace volume residual from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const {
    packageVolume,
    contentsVolume,
    measuredHeadspace,
    suppliedDisplacement,
  } = request;
  const compute = (): Output => {
    H.domain(
      [
        packageVolume,
        contentsVolume,
        measuredHeadspace,
        suppliedDisplacement,
      ].every((x) => x >= 0) &&
        contentsVolume + suppliedDisplacement <= packageVolume,
    );
    return {
      expectedHeadspace: packageVolume - contentsVolume - suppliedDisplacement,
      residual:
        measuredHeadspace -
        packageVolume +
        contentsVolume +
        suppliedDisplacement,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: {
    packageVolume: 100,
    contentsVolume: 70,
    measuredHeadspace: 25,
    suppliedDisplacement: 10,
  },
  output: { expectedHeadspace: 20, residual: 5 },
} satisfies ToolExample<Input, Output>;
export const packageHeadspaceVolumeResidualTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "food-technology/package-headspace-volume-residual",
    title: "Package Headspace Volume Residual Tool",
    description:
      "Calculate package headspace volume residual from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        packageVolume: { type: "number" },
        contentsVolume: { type: "number" },
        measuredHeadspace: { type: "number" },
        suppliedDisplacement: { type: "number" },
      },
      required: [
        "packageVolume",
        "contentsVolume",
        "measuredHeadspace",
        "suppliedDisplacement",
      ],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        expectedHeadspace: { type: "number" },
        residual: { type: "number" },
      },
      required: ["expectedHeadspace", "residual"],
    },
    ports: {
      inputs: [
        {
          id: "packageVolume",
          label: "Package Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "contentsVolume",
          label: "Contents Volume",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "measuredHeadspace",
          label: "Measured Headspace",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedDisplacement",
          label: "Supplied Displacement",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        {
          id: "expectedHeadspace",
          label: "Expected Headspace",
          valueType: { type: "number" },
        },
        { id: "residual", label: "Residual", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = packageHeadspaceVolumeResidualTool.execute;
export default packageHeadspaceVolumeResidualTool;
