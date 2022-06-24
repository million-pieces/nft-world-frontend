const {readGitignoreFiles} = require("eslint-gitignore");

module.exports = {
  extends: ["stylelint-config-standard", "stylelint-prettier/recommended"],
	plugins: [
		"stylelint-order"
	],
  ignorePatterns: readGitignoreFiles({cwd: __dirname}),
  rules: {
    "at-rule-no-unknown": null,
    "no-descending-specificity": null,
    "prettier/prettier": true,
    "order/properties-alphabetical-order": true,
  }
}
