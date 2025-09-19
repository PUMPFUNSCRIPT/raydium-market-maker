import * as SPL from '@solana/spl-token';
import { Connection } from '@solana/web3.js';
import autoTx from './src/autoTx.js';
import pumpFun from './src/pumpFun.js';
import { pumpSwapBuy, pumpSwapSell } from './src/pumpSwap.js';
import { organicVol, sellOnly } from './src/organicVol.js';
import { calculateVolumeAndCost, calculateVolumeAndCost2 } from './src/calc.js';
import chalk from 'chalk';
import Table from 'cli-table3';
import readline from 'readline';
import { readFileSync } from 'fs';
const config = JSON.parse(readFileSync('./config.json', 'utf8'));

function displayMainMenu() {
    const table = new Table({
        head: ['Option', 'Action', 'Description'],
        colWidths: [10, 30, 70],
    });

    table.push(
        ['1', 'Start Dex Trending', 'Perform up to 8 unique buy-and-sell actions per transaction,\nensuring minimal loss while significantly boosting token volume\nand makers to increase the chance to be on trending spot.'],
        ['2', 'Create Organic Vol', 'Executes up to four (4) purchases solely to boost volume and\nmakers per bundle, with the option to sell using sell mode.'],
        ['3', 'Sell Tokens', 'Immediately sell all tokens bought using organic volume mode'],
        ['4', 'Volume Calculator', 'Calculate the total token volume based on user-specified\nparameters such as Min and Max buy in SOL,\nDesired Volume, and token exchange rate.'],
        ['5', 'PumpSwap Bot', 'Pumpswap rank bot and sell bot'],
        ['6', 'PumpFUN Bot', 'PumpFUN rank bot and sell bot'],
        ['7', 'Exit', 'Exit the program / CTRL + C to exit at any point.']
    );
    console.log(table.toString());
}

function displayVolCalcMenu() {
    const table = new Table({
        head: ['Option', 'Action', 'Description'],
        colWidths: [10, 30, 70],
    });

    table.push(
        ['1', '📊 CALCULATE BASED ON\nDESIRED VOLUME', 'Estimate required transactions and SOL usage based on minimum buy,\nmaximum buy, and the desired token volume in USD.'],
        ['2', '📊 CALCULATE BASED ON\nTOTAL SOL TO SPEND', 'Determine the token volume that can be generated based on\nminimum/maximum buy, and the total SOL available for transactions.'],
        ['3', 'Back to Main Menu', 'Return to the main menu.']
    );
    console.log(table.toString());
}

function displayPumpSwapMenu() {
    const table = new Table({
        head: ['Option', 'Action', 'Description'],
        colWidths: [10, 30, 70],
    });

    table.push(
        ['1', 'PumpSwap Rank Bot', 'Perform 4 buys with unique makers that helps to boost rank on Dex'],
        ['2', 'PumpSwap Sell Token', 'Sell tokens bought using PumpSwap Rank Bot'],
        ['3', 'Back to Main Menu', 'Return to the main menu.']
    );
    console.log(table.toString());
}

async function getUserInput(prompt) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        rl.question(prompt, (input) => {
            rl.close();
            resolve(input.trim());
        });
    });
    process.on('exit', () => rl.close());
}

async function handleVolCalcMenu() {
    while (true) {
        displayVolCalcMenu();
        const choice = await getUserInput('\nEnter your choice: ');

        switch (choice) {
            case '1':
                await calculateVolumeAndCost();
                break;

            case '2':
                await calculateVolumeAndCost2();
                break;

            case '3':
                return;

            default:
                console.log(chalk.red('Invalid selection. Please choose a valid option.'));
        }
    }
}

async function handlePumpSwapMenu() {
    while (true) {
        displayPumpSwapMenu();
        const choice = await getUserInput('\nEnter your choice: ');

        switch (choice) {
            case '1':
                await pumpSwapBuy();
                break;

            case '2':
                await pumpSwapSell();
                break;

            case '3':
                return;

            default:
                console.log(chalk.red('Invalid selection. Please choose a valid option.'));
        }
    }
}

async function main() {
    while (true) {
        displayMainMenu();
        const choice = await getUserInput('\nEnter your choice: ');

        switch (choice) {
            case '1':
                console.log(chalk.green('\n---> MODE SELECTED <---'));
                console.log(chalk.hex('#FF9900')("🎉 VOL/MAKER BOOSTER\n\n"));
                await autoTx();
                break;
            case '2':
                console.log(chalk.green('\n---> MODE SELECTED <---'));
                console.log(chalk.hex('#FF9900')("🎉 ORGANIC VOL/MAKER BOOSTER\n\n"));
                await organicVol();
                break;
            case '3':
                console.log(chalk.green('\n---> MODE SELECTED <---'));
                console.log(chalk.hex('#FF9900')("🎉 SELL TOKENS\n\n"));
                await sellOnly();
                break;
            case '4':
                await handleVolCalcMenu();
                break;
            case '5':
                console.log(chalk.green('\n---> MODE SELECTED <---'));
                console.log(chalk.hex('#FF9900')("🎉 PUMPSWAP\n\n"));
                await handlePumpSwapMenu();
                break;
            case '6':
                console.log(chalk.green('\n---> MODE SELECTED <---'));
                console.log(chalk.hex('#FF9900')("🎉 PUMPFUN\n\n"));
                await pumpFun();
                break;
            case '7':
                console.log(chalk.green('Exiting program.'));
                return;
            default:
                console.log(chalk.red('Invalid selection. Please choose a valid option.'));
        }
    }
}

export default displayMainMenu;
main();
