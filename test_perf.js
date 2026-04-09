const fs = require('fs');
const { promises: fsPromises } = require('fs');
const path = require('path');

// Create a dummy image file for testing
const testFilePath = path.join(__dirname, 'dummy_screenshot.png');
const dummyBuffer = Buffer.alloc(1024 * 1024 * 5); // 5MB buffer
fs.writeFileSync(testFilePath, dummyBuffer);

async function testSync() {
    const start = process.hrtime.bigint();
    for (let i = 0; i < 100; i++) {
        const imageBuffer = fs.readFileSync(testFilePath);
        const base64Image = imageBuffer.toString('base64');
    }
    const end = process.hrtime.bigint();
    return Number(end - start) / 1e6; // ms
}

async function testAsync() {
    const start = process.hrtime.bigint();
    for (let i = 0; i < 100; i++) {
        const imageBuffer = await fsPromises.readFile(testFilePath);
        const base64Image = imageBuffer.toString('base64');
    }
    const end = process.hrtime.bigint();
    return Number(end - start) / 1e6; // ms
}

async function runBenchmark() {
    console.log("Warming up...");
    await testSync();
    await testAsync();

    console.log("Running Sync test...");
    const syncTime = await testSync();

    console.log("Running Async test...");
    const asyncTime = await testAsync();

    console.log(`Sync time: ${syncTime.toFixed(2)} ms`);
    console.log(`Async time: ${asyncTime.toFixed(2)} ms`);
    console.log(`Difference (Async vs Sync): ${((syncTime - asyncTime) / syncTime * 100).toFixed(2)}%`);

    // Cleanup
    fs.unlinkSync(testFilePath);
}

runBenchmark();
