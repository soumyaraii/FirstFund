/**
 * runFixtures.js
 * ---------------------------------------------------------
 * Loads every .json file in /fixtures and runs it through the
 * matching AI function, based on its "type" field.
 *
 * Usage:
 *   node runFixtures.js                  → runs ALL fixtures
 *   node runFixtures.js month4            → runs only fixtures whose filename contains "month4"
 *
 * To add a new test case: just drop a new .json file into
 * /fixtures following the same shape as the existing ones.
 * No code changes needed.
 * ---------------------------------------------------------
 */

const fs = require("fs");
const path = require("path");
const { generateDecisionFeedback, generateFinalSummary } = require("./index");

const FIXTURES_DIR = path.join(__dirname, "fixtures");

async function runFixture(filename) {
  const filePath = path.join(FIXTURES_DIR, filename);
  const raw = fs.readFileSync(filePath, "utf-8");
  const fixture = JSON.parse(raw);

  console.log("\n" + "=".repeat(70));
  console.log(`FILE: ${filename}`);
  console.log(`DESCRIPTION: ${fixture.description || "(no description)"}`);
  console.log("=".repeat(70));

  let result;
  const start = Date.now();

  try {
    if (fixture.type === "decisionFeedback") {
      result = await generateDecisionFeedback(fixture);
    } else if (fixture.type === "finalSummary") {
      result = await generateFinalSummary(fixture);
    } else {
      console.log(`⚠️  Unknown type "${fixture.type}" — skipping.`);
      return;
    }
  } catch (err) {
    console.error(`❌ FAILED: ${err.message}`);
    return;
  }

  const elapsed = Date.now() - start;
  console.log(`✅ Response (${elapsed}ms):`);
  console.log(JSON.stringify(result, null, 2));
}

async function main() {
  const filterArg = process.argv[2]; // optional substring filter

  let files = fs.readdirSync(FIXTURES_DIR).filter(f => f.endsWith(".json"));

  if (filterArg) {
    files = files.filter(f => f.includes(filterArg));
    console.log(`Running fixtures matching "${filterArg}": ${files.length} found`);
  } else {
    console.log(`Running ALL fixtures: ${files.length} found`);
  }

  for (const file of files) {
    await runFixture(file);
  }

  console.log("\n" + "=".repeat(70));
  console.log("Done.");
}

main();
