import * as H from "../../core/batch60-schema-calculation.js";
import type { ToolExample } from "../../core/example.js";

export type Input = {
  readonly contactStart: number;
  readonly contactEnd: number;
};
export type Output = { readonly contactDuration: number };
export const inputSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    contactStart: { type: "number" },
    contactEnd: { type: "number" },
  },
  required: ["contactStart", "contactEnd"],
} as const;
export const outputSchema = {
  type: "object",
  additionalProperties: false,
  properties: { contactDuration: { type: "number" } },
  required: ["contactDuration"],
} as const;
/** Calculate one supplied pollinator flower-contact duration from ordered monotonic times without inferring pollination effectiveness. */
export function calculate(request: Input): Output {
  H.requireInput(request, inputSchema);
  const { contactStart, contactEnd } = request;
  const compute = (): Output => {
    H.domain(contactEnd >= contactStart, "contactEnd");
    return { contactDuration: contactEnd - contactStart };
  };
  const calculated = H.canonicalOutput(compute());
  H.requireOutput(calculated, outputSchema);
  return calculated;
}
export const example = {
  input: { contactStart: 12, contactEnd: 17 },
  output: { contactDuration: 5 },
} satisfies ToolExample<Input, Output>;
export const pollinatorSingleFlowerContactDurationTool =
  H.defineSchemaCalculation<Input, Output>({
    ...{
      id: "entomology/pollinator-single-flower-contact-duration",
      title: "Pollinator Single Flower Contact Duration Tool",
      description:
        "Calculate one supplied pollinator flower-contact duration from ordered monotonic times without inferring pollination effectiveness.",
      inputSchema: {
        type: "object",
        additionalProperties: false,
        properties: {
          contactStart: { type: "number" },
          contactEnd: { type: "number" },
        },
        required: ["contactStart", "contactEnd"],
      },
      outputSchema: {
        type: "object",
        additionalProperties: false,
        properties: { contactDuration: { type: "number" } },
        required: ["contactDuration"],
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
        ],
        outputs: [
          {
            id: "contactDuration",
            label: "Contact Duration",
            valueType: { type: "number" },
          },
        ],
      },
    },
    calculate,
  });
export const run = pollinatorSingleFlowerContactDurationTool.execute;
export default pollinatorSingleFlowerContactDurationTool;
