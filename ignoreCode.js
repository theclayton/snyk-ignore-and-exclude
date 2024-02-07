const USAGE = `Usage:

node ignoreCode.js <filename>

----------------------------
Run the following and use thee output in this script
to create all the ignores needed for your .snyk file:

snyk code test --json-file-output=code.json

----------------------------
To show this help menu, run:

node ignoreCode.js -h
`;

const fs = require('fs').promises;

async function main() {
    const path = process.argv[2];

    if (!path || path === '-h' || path === '--help') {
        console.log(USAGE);
        process.exit(1);
    }

    const fileContents = await fs.readFile(path, "utf8");

    let data = {}

    try {
        data = JSON.parse(fileContents);
    } catch (e) {
        console.log('Failed to parse JSON.');
        process.exit(1);
    }

    const map = {}

    for (const vuln of data.runs[0].results) {
        for (const location of vuln.locations) {
            if (map[location.physicalLocation.artifactLocation.uri] === undefined) {
                map[location.physicalLocation.artifactLocation.uri] = 1
            }
        }
    }

    let content = `exclude:
    code:`;

    const vulnURIs = Object.keys(map)

    for (let i = 0; i < vulnURIs.length; i++) {
        const uri = vulnURIs[i]
        content += `
        - ${uri}`
    }

    console.log(content);
}

main();