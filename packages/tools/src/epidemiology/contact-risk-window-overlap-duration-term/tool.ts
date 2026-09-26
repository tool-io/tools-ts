import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly contactStart: number;
  readonly contactEnd: number;
  readonly riskStart: number;
  readonly riskEnd: number;
};
export type Output = { readonly overlap: number; readonly overlaps: boolean };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contactStart: { type: "number" },
    contactEnd: { type: "number" },
    riskStart: { type: "number" },
    riskEnd: { type: "number" },
  },
  required: ["contactStart", "contactEnd", "riskStart", "riskEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { overlap: { type: "number" }, overlaps: { type: "boolean" } },
  required: ["overlap", "overlaps"],
} as const;
/** Duration overlap of half-open contact and caller-supplied risk intervals, without assigning infection risk. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { contactStart, contactEnd, riskStart, riskEnd } = request;
  const compute = (): Output => {
    H.domain(contactEnd >= contactStart && riskEnd >= riskStart);
    return {
      overlap: Math.max(
        0,
        Math.min(contactEnd, riskEnd) - Math.max(contactStart, riskStart),
      ),
      overlaps:
        Math.min(contactEnd, riskEnd) > Math.max(contactStart, riskStart),
    };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { contactStart: 10, contactEnd: 30, riskStart: 20, riskEnd: 40 },
  output: { overlap: 10, overlaps: true },
} satisfies ToolExample<Input, Output>;
export const contactRiskWindowOverlapDurationTermTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "epidemiology/contact-risk-window-overlap-duration-term",
      title: "Contact Risk Window Overlap Duration Term Tool",
      description:
        "Duration overlap of half-open contact and caller-supplied risk intervals, without assigning infection risk.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          contactStart: { type: "number" },
          contactEnd: { type: "number" },
          riskStart: { type: "number" },
          riskEnd: { type: "number" },
        },
        required: ["contactStart", "contactEnd", "riskStart", "riskEnd"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          overlap: { type: "number" },
          overlaps: { type: "boolean" },
        },
        required: ["overlap", "overlaps"],
      },
      ports: {
        inputs: [
          {
            id: "contactStart",
            label: "Contact Start",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "contactEnd",
            label: "Contact End",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "riskStart",
            label: "Risk Start",
            required: true,
            valueType: { type: "number" },
          },
          {
            id: "riskEnd",
            label: "Risk End",
            required: true,
            valueType: { type: "number" },
          },
        ],
        outputs: [
          { id: "overlap", label: "Overlap", valueType: { type: "number" } },
          { id: "overlaps", label: "Overlaps", valueType: { type: "boolean" } },
        ],
      },
    },
    calculate,
  });
export const run = contactRiskWindowOverlapDurationTermTool.execute;
export default contactRiskWindowOverlapDurationTermTool;
