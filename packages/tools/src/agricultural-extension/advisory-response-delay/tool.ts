import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly requested: number;
  readonly responded: number;
  readonly suppliedPause: number;
};
export type Output = { readonly elapsed: number; readonly counted: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    requested: { type: "number" },
    responded: { type: "number" },
    suppliedPause: { type: "number", minimum: 0 },
  },
  required: ["requested", "responded", "suppliedPause"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { elapsed: { type: "number" }, counted: { type: "number" } },
  required: ["elapsed", "counted"],
} as const;
/** Calculate advisory response delay from explicit caller-supplied inputs. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { requested, responded, suppliedPause } = request;
  const compute = (): Output => {
    H.domain(
      responded >= requested &&
        suppliedPause >= 0 &&
        suppliedPause <= responded - requested,
    );
    return {
      elapsed: responded - requested,
      counted: responded - requested - suppliedPause,
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { requested: 10, responded: 30, suppliedPause: 5 },
  output: { elapsed: 20, counted: 15 },
} satisfies ToolExample<Input, Output>;
export const advisoryResponseDelayTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    id: "agricultural-extension/advisory-response-delay",
    title: "Advisory Response Delay Tool",
    description:
      "Calculate advisory response delay from explicit caller-supplied inputs.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        requested: { type: "number" },
        responded: { type: "number" },
        suppliedPause: { type: "number", minimum: 0 },
      },
      required: ["requested", "responded", "suppliedPause"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { elapsed: { type: "number" }, counted: { type: "number" } },
      required: ["elapsed", "counted"],
    },
    ports: {
      inputs: [
        {
          id: "requested",
          label: "Requested",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "responded",
          label: "Responded",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "suppliedPause",
          label: "Supplied Pause",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "elapsed", label: "Elapsed", valueType: { type: "number" } },
        { id: "counted", label: "Counted", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = advisoryResponseDelayTool.execute;
export default advisoryResponseDelayTool;
