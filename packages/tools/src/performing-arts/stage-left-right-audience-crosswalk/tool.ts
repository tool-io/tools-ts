import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = { readonly stageSide: string };
export type Output = { readonly audienceSide: string };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    stageSide: {
      type: "string",
      maxLength: 8192,
      enum: ["left", "right", "center"],
    },
  },
  required: ["stageSide"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { audienceSide: { type: "string", maxLength: 8192 } },
  required: ["audienceSide"],
} as const;
/** Map performer-facing-audience stage left/right to the facing-stage audience perspective. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { stageSide } = request;
  const compute = (): Output => {
    H.domain(["left", "right", "center"].includes(stageSide), "stageSide");
    return {
      audienceSide:
        stageSide === "left"
          ? "right"
          : stageSide === "right"
            ? "left"
            : "center",
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { stageSide: "left" },
  output: { audienceSide: "right" },
} satisfies ToolExample<Input, Output>;
export const stageLeftRightAudienceCrosswalkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "performing-arts/stage-left-right-audience-crosswalk",
    title: "Stage Left Right Audience Crosswalk Tool",
    description:
      "Map performer-facing-audience stage left/right to the facing-stage audience perspective.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        stageSide: {
          type: "string",
          maxLength: 8192,
          enum: ["left", "right", "center"],
        },
      },
      required: ["stageSide"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { audienceSide: { type: "string", maxLength: 8192 } },
      required: ["audienceSide"],
    },
    ports: {
      inputs: [
        {
          id: "stageSide",
          label: "Stage Side",
          required: true,
          valueType: { type: "string" },
        },
      ],
      outputs: [
        {
          id: "audienceSide",
          label: "Audience Side",
          valueType: { type: "string" },
        },
      ],
    },
  },
  calculate,
});
export const run = stageLeftRightAudienceCrosswalkTool.execute;
export default stageLeftRightAudienceCrosswalkTool;
