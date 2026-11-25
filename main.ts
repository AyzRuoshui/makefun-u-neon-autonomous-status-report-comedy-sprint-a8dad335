import * as fs from "node:fs";
import * as path from "node:path";

const MAX_UTF8_CHARS = 200;

const STATUS_REPORT_LINE: string =
  "Weekly status: delegated your sprint to three subagents, who burned $84 in tokens stuck in an infinite loop thanking each other for the helpful clarification.";

/** Validates that the status report is a single non-empty line within 200 UTF-8 characters. */
function validateStatusLine(raw: string): string {
  if (raw.trim().length === 0) {
    throw new Error("Status report line must not be empty or whitespace-only.");
  }
  if (/[\u0000-\u001f\u007f]/.test(raw)) {
    throw new Error("Status report line must be a single line with no control characters.");
  }
  const charCount = Array.from(raw).length;
  if (charCount > MAX_UTF8_CHARS) {
    throw new Error(`Status report line exceeds ${MAX_UTF8_CHARS} characters (got ${charCount}).`);
  }
  return raw;
}

/** Writes the single-line status report entry without a trailing newline. */
function main(): void {
  const outputDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  const line = validateStatusLine(STATUS_REPORT_LINE);

  fs.mkdirSync(outputDir, { recursive: true });
  const outputPath = path.join(outputDir, "entry.txt");
  fs.writeFileSync(outputPath, line, { encoding: "utf8" });
}

main();
