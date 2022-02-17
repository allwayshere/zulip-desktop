"use strict";
const {chan, put, take} = require("medium");
const test = require("tape");

const setup = require("./setup.js");

test("add-organization", async (t) => {
  t.timeoutAfter(50e3);
  setup.resetTestDataDir();
  const app = await setup.createApp();
  try {
    const windows = chan();
    for (const win of app.windows()) put(windows, win);
    app.on("window", (win) => put(windows, win));

    const mainWindow = await take(windows);
    t.equal(await mainWindow.title(), "Yim");

    const mainWebview = await take(windows);
    await mainWebview.fill(".setting-input-value", "chat.zulip.org");
    await mainWebview.click("#connect");

    const orgWebview = await take(windows);
    await orgWebview.waitForSelector("#id_username");
  } finally {
    await setup.endTest(app);
  }
});
