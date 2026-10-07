import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly voidTime: number;
  readonly retentionTime: number;
};
export type Output = { readonly signedGap: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    voidTime: { type: "number" },
    retentionTime: { type: "number" },
  },
  required: ["voidTime", "retentionTime"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { signedGap: { type: "number" } },
  required: ["signedGap"],
} as const;
/** Subtract supplied chromatographic void time from retention time in the same units, retaining negative discrepancies. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { voidTime, retentionTime } = request;
  const compute = (): Output => {
    return { signedGap: retentionTime - voidTime };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { voidTime: 12, retentionTime: 17 },
  output: { signedGap: 5 },
} satisfies ToolExample<Input, Output>;
export const chromatographyVoidTimeCorrectedDelayTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      discovery: {
        aliases: [],
        collections: ["data", "learn"],
        fields: ["biochemistry", "biology"],
        keywords: ["biochemistry", "biology"],
      },
      id: "biochemistry/chromatography-void-time-corrected-delay",
      title: "Chromatography Void Time Corrected Delay",
      description:
        "Subtract supplied chromatographic void time from retention time in the same units, retaining negative discrepancies.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          voidTime: { type: "number" },
          retentionTime: { type: "number" },
        },
        required: ["voidTime", "retentionTime"],
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
            id: "voidTime",
            label: "Void Time",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "retentionTime",
            label: "Retention Time",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          {
            id: "signedGap",
            label: "Signed Gap",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = chromatographyVoidTimeCorrectedDelayTool.execute;
export default chromatographyVoidTimeCorrectedDelayTool;
