import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly drainMarkerSeconds: number;
  readonly returnMarkerSeconds: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    drainMarkerSeconds: { type: "number" },
    returnMarkerSeconds: { type: "number" },
  },
  required: ["drainMarkerSeconds", "returnMarkerSeconds"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract explicit drain and return markers on the same time basis without detecting transit events. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { drainMarkerSeconds, returnMarkerSeconds } = request;
  const compute = (): Output => {
    return { signedGap: returnMarkerSeconds - drainMarkerSeconds };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { drainMarkerSeconds: 12, returnMarkerSeconds: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const drainReturnTimeOffsetTool = H.defineSchemaCalculation<
  Input,
  Output
>({
  ...{
    discovery: {
      aliases: [],
      collections: ["learn"],
      fields: ["hydroponics", "agriculture"],
      keywords: ["hydroponics", "agriculture"],
    },
    id: "hydroponics/drain-return-time-offset",
    title: "Drain Return Time Offset",
    description:
      "Subtract explicit drain and return markers on the same time basis without detecting transit events.",
    inputSchema: {
      type: "object",
      additionalProperties: false,
      properties: {
        drainMarkerSeconds: { type: "number" },
        returnMarkerSeconds: { type: "number" },
      },
      required: ["drainMarkerSeconds", "returnMarkerSeconds"],
    },
    outputSchema: {
      type: "object",
      additionalProperties: false,
      properties: { signedGap: { type: "number" } },
      required: ["signedGap"],
    },
    ports: {
      inputs: [
        {
          id: "drainMarkerSeconds",
          label: "Drain Marker Seconds",
          required: true,
          valueType: { type: "number" },
        },
        {
          id: "returnMarkerSeconds",
          label: "Return Marker Seconds",
          required: true,
          valueType: { type: "number" },
        },
      ],
      outputs: [
        { id: "signedGap", label: "Signed Gap", valueType: { type: "number" } },
      ],
    },
  },
  calculate,
});
export const run = drainReturnTimeOffsetTool.execute;
export default drainReturnTimeOffsetTool;
