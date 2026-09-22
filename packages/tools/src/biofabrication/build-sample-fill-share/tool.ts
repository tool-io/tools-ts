import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly sampleArea: number; readonly buildArea: number };
export type Output = { readonly share: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    sampleArea: { type: "number", minimum: 0 },
    buildArea: { type: "number", exclusiveMinimum: 0 },
  },
  required: ["sampleArea", "buildArea"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { share: { type: "number" } },
  required: ["share"],
} as const;
/** Calculate build sample fill share from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { sampleArea, buildArea } = request;
  const compute = (): Output => {
    H.positive(buildArea);
    H.domain(sampleArea >= 0 && sampleArea <= buildArea);
    return { share: sampleArea / buildArea };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { sampleArea: 2, buildArea: 10 },
  output: { share: 0.2 },
} satisfies ToolExample<Input, Output>;
export const buildSampleFillShareTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "biofabrication/build-sample-fill-share",
    title: "Build Sample Fill Share Tool",
    description:
      "Calculate build sample fill share from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        sampleArea: { type: "number", minimum: 0 },
        buildArea: { type: "number", exclusiveMinimum: 0 },
      },
      required: ["sampleArea", "buildArea"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { share: { type: "number" } },
      required: ["share"],
    },
    ports: {
      inputs: [
        {
          id: "sampleArea",
          label: "Sample Area",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "buildArea",
          label: "Build Area",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [{ id: "share", label: "Share", valueType: { type: "number" } }],
    },
  },
  calculate,
});
export const run = buildSampleFillShareTool.execute;
export default buildSampleFillShareTool;
