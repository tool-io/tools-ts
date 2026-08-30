import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type DataUriSizeInput = Readonly<{
  readonly dataUri: string;
}>;
export type DataUriSizeOutput = Readonly<{
  readonly byteLength: number;
}>;

export const calculateDataUriSize = (
  x: DataUriSizeInput,
): DataUriSizeOutput => {
  if (typeof x.dataUri !== "string")
    simpleError("dataUri", "Provide a string.");
  if (!x.dataUri.startsWith("data:"))
    simpleError("dataUri", "URI must begin with data:.");
  const comma = x.dataUri.indexOf(",");
  if (comma < 5) simpleError("dataUri", "Data URI needs metadata and a comma.");
  const meta = x.dataUri.slice(5, comma),
    payload = x.dataUri.slice(comma + 1).split("#", 1)[0];
  let byteLength = 0;
  if (/;base64$/i.test(meta)) {
    if (
      !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(
        payload,
      )
    )
      simpleError("dataUri", "Expected canonical padded Base64.");
    byteLength =
      (payload.length / 4) * 3 -
      (payload.endsWith("==") ? 2 : payload.endsWith("=") ? 1 : 0);
  } else {
    for (let i = 0; i < payload.length; i++) {
      const code = payload.charCodeAt(i);
      if (payload[i] === "%") {
        if (
          i + 2 >= payload.length ||
          !/^[0-9A-Fa-f]{2}$/.test(payload.slice(i + 1, i + 3))
        )
          simpleError("dataUri", "Malformed percent escape.");
        i += 2;
      } else if (code > 127)
        simpleError(
          "dataUri",
          "Raw non-ASCII payload must be percent-encoded.",
        );
      byteLength++;
    }
  }
  return { byteLength };
};

export const example = {
  input: { dataUri: "data:text/plain,hello%20world" },
  output: { byteLength: 11 },
} satisfies ToolExample<DataUriSizeInput, DataUriSizeOutput>;

export const tool = createSimpleTool({
  id: "web/data-uri-size",
  title: "Data URI Size",
  description:
    "Count decoded payload bytes in a canonical ASCII data URI with percent escapes or standard padded Base64; this does not fetch or render its content.",
  inputs: [{ id: "dataUri", kind: "string", label: "Data URI" }],
  outputs: [
    {
      id: "byteLength",
      kind: "integer",
      label: "Decoded payload length",
      unit: "B",
    },
  ],
  calculate: (input) =>
    calculateDataUriSize({
      dataUri: input.dataUri as string,
    }),
});
export const dataUriSizeTool = tool;
export const runDataUriSize = tool.execute;
export default tool;
