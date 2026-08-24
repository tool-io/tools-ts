import type { ToolExample } from "../../core/example.js";
import {
  createSimpleTool,
  SimpleToolError,
  simpleError,
} from "../../core/simple.js";
import { base64ToBytes, utf8Decode } from "../../core/encoding.js";

export type JwtInput = {
  readonly token: string;
};

export type JwtOutput = {
  readonly header: Record<string, unknown>;
  readonly payload: Record<string, unknown>;
  readonly signatureHex: string;
  readonly signaturePresent: boolean;
  readonly status: string;
};

const BASE64URL = /^[A-Za-z0-9_-]*$/;
const base64UrlToBytes = (value: string): number[] => {
  const body = value.replace(/=+$/u, "");
  if (!BASE64URL.test(body) || body.length % 4 === 1)
    simpleError(
      "token",
      "The segment is not valid unpadded base64url.",
      "invalid_segment_encoding",
    );
  const standard = body.replaceAll("-", "+").replaceAll("_", "/");
  return base64ToBytes(
    standard.padEnd(Math.ceil(standard.length / 4) * 4, "="),
  );
};

const decodeSegment = (
  segment: string,
  field: string,
): Record<string, unknown> => {
  if (!BASE64URL.test(segment))
    simpleError(
      field,
      "The segment is not valid unpadded base64url.",
      "invalid_segment_encoding",
    );
  const decoded = (() => {
    try {
      return utf8Decode(base64UrlToBytes(segment), field);
    } catch (error) {
      if (error instanceof SimpleToolError) throw error;
      return simpleError(
        field,
        "The segment could not be decoded.",
        "invalid_segment_encoding",
      );
    }
  })();
  let parsed: unknown;
  try {
    parsed = JSON.parse(decoded) as unknown;
  } catch (error) {
    if (error instanceof SimpleToolError) throw error;
    simpleError(
      field,
      "The decoded segment is not valid JSON.",
      "invalid_json_segment",
    );
  }
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed))
    simpleError(
      field,
      "The decoded segment must be a JSON object.",
      "invalid_json_segment",
    );
  return parsed as Record<string, unknown>;
};

/**
 * Decodes a JWS compact serialization (header.payload.signature) without
 * verifying the signature: header and payload are base64url-decoded and
 * parsed as JSON objects, while the signature is only checked for
 * presence and reported as raw bytes.
 */
export const calculateJwt = (input: JwtInput): JwtOutput => {
  const segments = input.token.split(".");
  if (segments.length !== 3)
    simpleError(
      "token",
      "A JWT must have exactly three dot-separated segments.",
      "malformed_jwt",
    );
  const [headerSegment, payloadSegment, signatureSegment] = segments as [
    string,
    string,
    string,
  ];
  const signaturePresent = signatureSegment !== "";
  if (signaturePresent && !BASE64URL.test(signatureSegment))
    simpleError(
      "token",
      "The signature segment is not valid unpadded base64url.",
      "invalid_segment_encoding",
    );
  return {
    header: decodeSegment(headerSegment, "token"),
    payload: decodeSegment(payloadSegment, "token"),
    signatureHex: signaturePresent
      ? base64UrlToBytes(signatureSegment)
          .map((byte) => byte.toString(16).padStart(2, "0"))
          .join("")
      : "",
    signaturePresent,
    status: "unverified",
  };
};

export const jwtExample = {
  input: {
    token:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkYSBMb3ZlbGFjZSJ9.c2lnbmF0dXJl",
  },
  output: {
    header: { alg: "HS256", typ: "JWT" },
    payload: { name: "Ada Lovelace", sub: "1234567890" },
    signatureHex: "7369676e6174757265",
    signaturePresent: true,
    status: "unverified",
  },
} satisfies ToolExample<JwtInput, JwtOutput>;

export const jwtTool = createSimpleTool({
  calculate: (rawInput) => calculateJwt({ token: rawInput.token as string }),
  description:
    "Decode a JWT's header and payload from base64url JSON and report the signature bytes; the signature is never verified, so status is always unverified.",
  id: "decode/jwt",
  inputs: [
    {
      description:
        "JWT in JWS compact serialization (three dot-separated segments).",
      id: "token",
      kind: "string",
      label: "Token",
    },
  ],
  outputs: [
    {
      description: "Decoded JOSE header claims.",
      id: "header",
      kind: "object",
      label: "Header",
    },
    {
      description: "Decoded payload claims.",
      id: "payload",
      kind: "object",
      label: "Payload",
    },
    {
      description: "Raw signature bytes as lowercase hex; empty when absent.",
      id: "signatureHex",
      kind: "string",
      label: "Signature hex",
    },
    {
      description:
        "Whether a non-empty signature segment exists (presence only).",
      id: "signaturePresent",
      kind: "boolean",
      label: "Signature present",
    },
    {
      description:
        "Always unverified: this tool performs no cryptographic or key-based validation.",
      id: "status",
      kind: "string",
      label: "Status",
    },
  ],
  title: "JWT Decoder",
});
export const runJwt = jwtTool.execute;
export default jwtTool;
