import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly upstageDistance: number;
  readonly risePerRun: number;
  readonly datumHeight: number;
};
export type Output = { readonly height: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    upstageDistance: { type: "number", minimum: 0 },
    risePerRun: { type: "number" },
    datumHeight: { type: "number" },
  },
  required: ["upstageDistance", "risePerRun", "datumHeight"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { height: { type: "number" } },
  required: ["height"],
} as const;
/** Calculate stage rake height at mark from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { upstageDistance, risePerRun, datumHeight } = request;
  const compute = (): Output => {
    H.domain(upstageDistance >= 0);
    return { height: datumHeight + upstageDistance * risePerRun };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { upstageDistance: 10, risePerRun: 0.05, datumHeight: 1 },
  output: { height: 1.5 },
} satisfies ToolExample<Input, Output>;
export const stageRakeHeightAtMarkTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "performing-arts/stage-rake-height-at-mark",
    title: "Stage Rake Height At Mark Tool",
    description:
      "Calculate stage rake height at mark from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        upstageDistance: { type: "number", minimum: 0 },
        risePerRun: { type: "number" },
        datumHeight: { type: "number" },
      },
      required: ["upstageDistance", "risePerRun", "datumHeight"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { height: { type: "number" } },
      required: ["height"],
    },
    ports: {
      inputs: [
        {
          id: "upstageDistance",
          label: "Upstage Distance",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "risePerRun",
          label: "Rise Per Run",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "datumHeight",
          label: "Datum Height",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "height", label: "Height", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = stageRakeHeightAtMarkTool.execute;
export default stageRakeHeightAtMarkTool;
