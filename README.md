# Snyk Ignore & Exclude

Scripts for generating Snyk policy files that ignore and exclude all your Snyk vulnerabilities. Helpful for creating CI gates while having a backlog of vulnerabilities.

- Prerequisites: Install NodeJS and Snyk CLI

## Usage:

0.  Run Snyk CLI scans and output to a JSON file:

    ```properties
    snyk test --json-file-output=test.json
    ```

1.  Then generate the ignores needed for your .snyk policy file:

    ```properties
    node ignoreOSS.js test.json
    ```

2.  Copy output to you .snyk file. Output appears as:

```yml
ignore:
    SNYK-JS-AWSSDK-6959424:
        - widgets-inc@1.0.0 > aws-sdk@2.714.0:
            reason: "Backlog: high - Prototype Pollution"
            expires: ""
    SNYK-JS-AXIOS-6932459:
        - widgets-inc@1.0.0 > twilio@4.16.0 > axios@0.26.1 / widgets-inc@0.0.1 > @widgets-inc/asdf@0.1.4 > twilio@4.16.0 > axios@0.26.1 / widgets-inc@1.0.0 > axios@1.4.0:
            reason: "Backlog: high - Cross-site Request Forgery (CSRF)"
            expires: ""
    ...
```

---

- Currently only supports Snyk policy version `v1.25.0`
- Note: If more than 2 locations are found, the `'*'` characters will be used instead of appending all the locations together in order to ensure valid YAML formatting.
