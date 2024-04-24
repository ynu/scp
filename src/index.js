#!/usr/bin/env node

import process from "process";
import { program } from "commander";
import chalk from "chalk";
import inquirer from "inquirer";
import ora from "ora";
import figlet from "figlet";
import { say_hello, times_str } from "./utli.js";

/**
 * show the logo
 * @returns {void}
 */
function show_logo() {
  console.log(
    chalk.yellow(figlet.textSync(say_hello(), { horizontalLayout: "full" })),
  );
}

/**
 * Process the choice according to the user's choice
 * @param {{ choice: string }} result - the user's choice
 * @returns {void}
 */
function process_choice(result) {
  const spinner = ora(`Doing ${result.choice}...`).start(); // 启动旋转器动画
  setTimeout(() => {
    spinner.succeed(chalk.green("Done!")); // 3秒后完成，显示成功消息
  }, 3000);
}

/**
 * fetch data from the url
 * @param {string} url - the url to fetch data
 * @returns {Promise<Object>} the result
 */
async function fetch_demo(url = "https://api.github.com/users/github") {
  const spinner = ora("Fetching data...").start();
  const response = await fetch(url);
  const data = await response.json();
  spinner.succeed("Data fetched successfully!");
  return data;
}

/**
 * main function of the program
 * @returns {Promise<void>} the result
 */
async function main() {
  show_logo();
  program.version("1.0.0").description("My Node CLI");
  program.action(async () => {
    const result = await inquirer.prompt([
      {
        type: "list",
        name: "choice",
        message: "Choose an option:",
        choices: ["Option 1", "Option 2", "Option 3"],
      },
    ]);
    process_choice(result);
  });
  program.parse(process.argv);
  console.info(`invoke times_str: ${times_str(3, "hello")}`);
  console.info(`fetch some sample data: ${await fetch_demo()}`);
}

main();
